import { IMenuItem } from "./IMenuItem";

export interface IMenu{
    id?: string,
    menuName: string,
    cafeId: string,
    menuItems?: IMenuItem[];
}