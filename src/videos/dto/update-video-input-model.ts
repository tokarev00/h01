import {ResolutionsEnum} from "../types/video";

export type UpdateVideoInputModel = {
    title: string;
    author: string;
    availableResolutions: ResolutionsEnum[];
    canBeDownloaded: boolean;
    minAgeRestriction: number | null;
    publicationDate: string;
};
