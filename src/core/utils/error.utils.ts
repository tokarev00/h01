import {FieldError} from "../types/field-error";
import {APIErrorResult} from "../types/api-error-result";

export const createErrorMessages = (
    fieldErrors: FieldError[],
): APIErrorResult => {
    return { errorsMessages: fieldErrors };
};