import { ICafeCategory } from "./ICafeCategory";
import { ICafeOccasion } from "./ICafeOccasion";
import { ICafeType } from "./ICafeType";
import { IFavourite } from "./IFavourite";
import { IMenu } from "./IMenu";
import { IReview } from "./IReview";

export interface ICafe{
        id?: string,
        cafeName: string,
        cafeAddress: string,
        cafeEmail: string,
        cafeTelephone: string,
        cafeWebsiteLink: string,
        cafeAverageRating: number,
        photoLink: string,
        cityId: string,
        cityName?: string,
        appUserId: string,
        menus?: IMenu[] | {$values: IMenu[] };
        reviews?: IReview[] | { $values: IReview[] };
        cafeCategories?: ICafeCategory[];
        cafeTypes?: ICafeType[] | { $values: ICafeType[] };
        cafeOccasions?: ICafeOccasion[] | { $values: ICafeOccasion[] };
        favourites?: IFavourite[] | { $values: IFavourite[] };
}

