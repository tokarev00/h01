import express from "express";
import { db } from "../../db/in-memory.db";
import {ResolutionsEnum, Video} from "../types/video";
import {HttpStatus} from "../../core/types/http-statuses";
import {CreateVideoInputModel} from "../dto/create-video-input-model";
import {validateCreateVideoInput, validateUpdateVideoInput} from "../validation/video-validation";
import {createErrorMessages} from "../../core/utils/error.utils";
import {validateIdParam} from "../validation/validate-id-param.middleware";
import {UpdateVideoInputModel} from "../dto/update-video-input-model";

export const videosRouter = express.Router({});



videosRouter
    .get("/", async (req: express.Request, res: express.Response) => {
        res.status(HttpStatus.Ok).send(db.videos);
    })
    .get("/:id", validateIdParam, async (req: express.Request, res: express.Response) => {
        const id: number = (res.locals as any).id;

        const video = db.videos.find((v: Video) => v.id === id);
        if (!video) {
            res.status(HttpStatus.NotFound).send("No such video");
        }
        res.status(200).send(video);

    })
    .post("/", async (req: express.Request, res: express.Response) => {
        const body = req.body as Partial<CreateVideoInputModel>;
        const errors = validateCreateVideoInput(body);
        if (errors.length > 0) {
            return res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
        }

        const nowIso = new Date().toISOString();
        const newVideo: Video = {
            id: (db.videos.length > 0 ? db.videos[db.videos.length - 1].id : 0) + 1,
            title: body.title!.trim(),
            author: body.author!.trim(),
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: nowIso,
            publicationDate: nowIso,
            availableResolutions: body.availableResolutions as ResolutionsEnum[],
        };

        db.videos.push(newVideo);
        return res.status(HttpStatus.Created).send(newVideo);
    })
    .put("/:id", validateIdParam, async (req: express.Request, res: express.Response) => {
        const id: number = (res.locals as any).id;
        const video = db.videos.find(v => v.id === id);
        if (!video) {
            return res.status(HttpStatus.NotFound).send("No such video");
        }

        const body = req.body as Partial<UpdateVideoInputModel>;
        const errors = validateUpdateVideoInput(body);
        if (errors.length > 0) {
            return res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
        }

        video.title = body.title!.trim();
        video.author = body.author!.trim();
        video.availableResolutions = body.availableResolutions as ResolutionsEnum[];
        video.canBeDownloaded = body.canBeDownloaded!;
        video.minAgeRestriction = body.minAgeRestriction ?? null;
        video.publicationDate = body.publicationDate!;

        return res.sendStatus(HttpStatus.NoContent);
    })
    .delete("/:id", validateIdParam, async (req: express.Request, res: express.Response) => {
        const id: number = (res.locals as any).id;

        const index = db.videos.findIndex(v => v.id === id);
        if (index === -1) {
            return res.status(HttpStatus.NotFound).type("text/plain").send("No such video");
        }

        db.videos.splice(index, 1);

        return res.sendStatus(HttpStatus.NoContent); // 204, тело отсутствует
    })
