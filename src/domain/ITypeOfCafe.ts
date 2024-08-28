import { ICafeType } from "./ICafeType";

export interface ITypeOfCafe{
    id?: string,
    typeOfCafeName: string,
    typeOfCafeDescription: string,
    cafeTypes?: ICafeType [] | {$values: ICafeType[]};
}