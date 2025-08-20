import express, { Express } from "express";
import {HttpStatus} from "./core/types/http-statuses";
import {videosRouter} from "./videos/routers/videos.router";
import {testingRouter} from "./testing/routers/testing.router";

export const setupApp = (app: Express) => {
    app.use(express.json()); // middleware для парсинга JSON в теле запроса

    // основной роут
    app.get("/", (req, res) => {
        res.status(HttpStatus.Ok).send("Hello world!");
    });
    app.use('/videos', videosRouter);
    app.use('/testing', testingRouter);
    return app;
};