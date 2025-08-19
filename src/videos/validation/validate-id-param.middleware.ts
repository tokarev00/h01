import express from "express";
import {FieldError} from "../../core/types/field-error";
import {HttpStatus} from "../../core/types/http-statuses";
import {createErrorMessages} from "../../core/utils/error.utils";

const INT32_MIN = 1;
const INT32_MAX = 2147483647

export function validateIdParam(req: express.Request, res: express.Response, next: express.NextFunction) {
    const raw = req.params.id;
    const errors: FieldError[] = [];

    if (raw === undefined || raw === null || raw === "") {
        errors.push({ field: "id", message: "id is required" });
    } else {
        if (!/^\d+$/.test(raw)) {
            errors.push({ field: "id", message: "id must be an integer number" });
        } else {
            const id = Number(raw);
            if (!Number.isSafeInteger(id)) {
                errors.push({ field: "id", message: "id is not a safe integer" });
            } else if (id < INT32_MIN || id > INT32_MAX) {
                errors.push({
                    field: "id",
                    message: `id must be between ${INT32_MIN} and ${INT32_MAX}`,
                });
            } else {
                (res.locals as any).id = id;
            }
        }
    }

    if (errors.length > 0) {
        return res.status(HttpStatus.BadRequest).json(createErrorMessages(errors));
    }

    return next();
}