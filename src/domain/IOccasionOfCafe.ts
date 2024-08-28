import { ICafeOccasion } from "./ICafeOccasion";

export interface IOccasionOfCafe{
    id?: string,
    occasionOfCafeName: string,
    occasionOfCafeDescription: string,
    cafeOccasions?: ICafeOccasion [] | {$values: ICafeOccasion[]};
}