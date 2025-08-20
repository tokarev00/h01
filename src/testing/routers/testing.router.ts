import {db} from "../../db/in-memory.db";
import {HttpStatus} from "../../core/types/http-statuses";
import {Request, Response, Router} from "express";

export const testingRouter = Router({});

testingRouter.delete('/all-data', (req: Request, res: Response) => {
    db.videos = [];
    res.send(HttpStatus.NoContent);
});