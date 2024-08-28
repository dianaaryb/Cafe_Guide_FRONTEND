import {IMenuItem} from "./IMenuItem";

export interface IMenuItemCategory{
    id?: string,
    menuItemCategoryName: string,
    menuItems?: IMenuItem[] | {$values: IMenuItem[]}
}