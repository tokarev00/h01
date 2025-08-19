import {ResolutionsEnum} from "../types/video";

export type CreateVideoInputModel = {
    title: string;
    author: string;
    availableResolutions: ResolutionsEnum[];
};
