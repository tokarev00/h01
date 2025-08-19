import {ResolutionsEnum} from "../types/video";
import {FieldError} from "../../core/types/field-error";
import {CreateVideoInputModel} from "../dto/create-video-input-model";
import {UpdateVideoInputModel} from "../dto/update-video-input-model";

type Maybe<T> = T | null | undefined;
export const enumValues = Object.values(ResolutionsEnum);

export function validateRequiredString(
    field: string,
    value: Maybe<unknown>,
    opts?: { max?: number }
): FieldError[] {
    const errors: FieldError[] = [];
    if (value === undefined || value === null) {
        errors.push({ field, message: `${field} is required` });
    } else if (typeof value !== "string") {
        errors.push({ field, message: `${field} must be a string` });
    } else if (value.trim().length === 0) {
        errors.push({ field, message: `${field} cannot be empty` });
    } else if (opts?.max !== undefined && value.trim().length > opts.max) {
        errors.push({ field, message: `${field} max length is ${opts.max}` });
    }
    return errors;
}

export function validateAvailableResolutionsField(
    value: Maybe<unknown>
): FieldError[] {
    const field = "availableResolutions";
    const errors: FieldError[] = [];
    if (value === undefined || value === null) {
        errors.push({ field, message: `${field} is required` });
        return errors;
    }
    if (!Array.isArray(value)) {
        errors.push({ field, message: `${field} must be an array` });
        return errors;
    }
    if (value.length === 0) {
        errors.push({ field, message: `At least one resolution should be added` });
        return errors;
    }
    const invalid = value.filter(v => !enumValues.includes(v as any));
    if (invalid.length > 0) {
        errors.push({
            field,
            message: `${field} contains invalid value(s): ${invalid.join(", ")}`
        });
    }
    return errors;
}

export function validateBoolean(field: string, value: Maybe<unknown>): FieldError[] {
    const errors: FieldError[] = [];
    if (value === undefined || value === null) {
        errors.push({ field, message: `${field} is required` });
    } else if (typeof value !== "boolean") {
        errors.push({ field, message: `${field} must be a boolean` });
    }
    return errors;
}


export function validateMinAgeRestriction(
    value: Maybe<unknown>
): FieldError[] {
    const field = "minAgeRestriction";
    const errors: FieldError[] = [];
    if (value === null) return errors; // null = no restriction
    if (value === undefined) {
        errors.push({ field, message: `${field} is required` });
        return errors;
    }
    if (typeof value !== "number" || !Number.isInteger(value)) {
        errors.push({ field, message: `${field} must be an integer or null` });
    } else if (value < 1 || value > 18) {
        errors.push({ field, message: `${field} must be between 1 and 18` });
    }
    return errors;
}

export function validateISODateTime(field: string, value: Maybe<unknown>): FieldError[] {
    const errors: FieldError[] = [];
    if (value === undefined || value === null) {
        errors.push({ field, message: `${field} is required` });
    } else if (typeof value !== "string") {
        errors.push({ field, message: `${field} must be a string` });
    } else {
        const d = new Date(value);
        if (Number.isNaN(d.getTime()) || value !== d.toISOString()) {
            errors.push({ field, message: `${field} must be a valid ISO date-time` });
        }
    }
    return errors;
}

export function validateCreateVideoInput(body: Partial<CreateVideoInputModel>): FieldError[] {
    return [
        ...validateRequiredString("title", body.title, { max: 40 }),
        ...validateRequiredString("author", body.author, { max: 20 }),
        ...validateAvailableResolutionsField(body.availableResolutions),
    ];
}

export function validateUpdateVideoInput(body: Partial<UpdateVideoInputModel>): FieldError[] {
    return [
        ...validateRequiredString("title", body.title, { max: 40 }),
        ...validateRequiredString("author", body.author, { max: 20 }),
        ...validateAvailableResolutionsField(body.availableResolutions),
        ...validateBoolean("canBeDownloaded", body.canBeDownloaded),
        ...validateMinAgeRestriction(body.minAgeRestriction),
        ...validateISODateTime("publicationDate", body.publicationDate),
    ];
}