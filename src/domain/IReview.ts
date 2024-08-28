import { IReviewPhoto } from "./IReviewPhoto";

// export interface IAppUser{
//     firstName: string;
//     lastName: string;
// }


export interface IReview{
    id?: string,
    rating: number,
    text: string,
    date: Date,
    appUserId: string,
    cafeId: string,
    cafeName?: string,
    reviewPhotos?: IReviewPhoto[] | {$values: IReviewPhoto[]};
    // appUser?: IAppUser; 
}