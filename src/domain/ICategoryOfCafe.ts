import { ICafeCategory } from "./ICafeCategory";

export interface ICategoryOfCafe{
    id?: string,
    categoryOfCafeName: string,
    categoryOfCafeDescription: string,
    cafeCategories?: ICafeCategory [] | {$values: ICafeCategory[]};
}