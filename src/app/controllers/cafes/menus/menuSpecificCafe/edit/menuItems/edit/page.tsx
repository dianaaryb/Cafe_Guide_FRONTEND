"use client"

import { IMenu } from "@/domain/IMenu";
import { IMenuItem } from "@/domain/IMenuItem";
import { IMenuItemCategory } from "@/domain/IMenuItemCategory";
import MenuItemCategoryService from "@/services/MenuItemCategoryService";
import MenuItemService from "@/services/MenuItemService";
import MenuService from "@/services/MenuService";
import { AppContext, GetUserInfo } from "@/state/AppContext";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function Edit(){
    const router = useRouter();
    const context = useContext(AppContext);
    const[menuItemName, setMenuItemName] = useState("");
    const[menuItemDescription, setMenuItemDescription] = useState("");
    const[menuItemPrice, setMenuItemPrice] = useState(0);
    const[photoLink, setPhotoLink] = useState("");
    const[menuItemCategoryId, setMenuItemCategoryId] = useState("");
    const[menuId, setMenuId] = useState("");
    const[menuName, setMenuName] = useState("");
    const [validationError, setvalidationError] = useState("");
    const[menus, setMenus] = useState<IMenu[]>([]);
    const searchParams = useSearchParams();
    const id = useSearchParams().get("id");
    const userInfo = GetUserInfo();
    const [isLoading, setIsLoading] = useState(true);
    const[menuItemCategories, setMenuItemCategories] = useState<IMenuItemCategory[]>([])
    

    useEffect(() => {
        const loadData = async () => {
            try{
                if(id){
                    const response = await MenuItemService.getById(id);
                    if(response.data){
                        setMenuItemName(response.data.menuItemName);
                        setMenuItemDescription(response.data.menuItemDescription);
                        setMenuItemPrice(response.data.menuItemPrice);
                        setPhotoLink(response.data.photoLink);
                        setMenuItemCategoryId(response.data.menuItemCategoryId);
                        setMenuId(response.data.menuId);
                    }
                    const menusResult = await MenuService.getAllMenus();
                    if(menusResult.data){
                        setMenus(menusResult.data);
                        if (menuId) {
                            setMenuId(menuId);
                            const menu = menusResult.data.find(menu => menu.id === menuId);
                            if (menu) {
                                setMenuName(menu.menuName);
                            }
                        }
                    }
                    const categoriesResult = await MenuItemCategoryService.getAll();
                    if (categoriesResult.data) {
                        setMenuItemCategories(categoriesResult.data);
                    } else {
                        setMenuItemCategories([]);
                    }
                    
                }
            }catch (error) {
                console.error('Failed to load cafes:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();

    }, [id]);

    const validateAndUpdate = async() => {
        if(!menuItemName || !menuItemPrice){
            setvalidationError("Menu item name and price must be set!");
            return;
        }

        try{
            if(id){
                const menuItemData: IMenuItem = {
                    menuItemName,
                    menuItemDescription,
                    menuItemPrice,
                    photoLink,
                    menuItemCategoryId,
                    menuId
                }
                const result = await MenuItemService.update(id, menuItemData, userInfo?.jwt!);
    
                if (result.data !== undefined) {
                    router.push(`/controllers/cafes/menus/menuSpecificCafe/edit/menuItems?id=${menuId}`)

                } else if(result.errors){
                    console.error('Update errors:', result.errors);
                }else {
                    setvalidationError("Failed to update cafe");
                }

            }
        }catch (error) {
            setvalidationError("Menu Item update failed. Please try again later.");
        }
    };

    if (isLoading) return (<h1>Loading...</h1>);

    return(
     
        <>  
        <h1>Edit menu item</h1>
        <hr />
        <div className="row">
            <div className="col-md-4">
            <div className="text-danger" role="alert">{validationError}</div>
                    <div className="form-group">
                        <label className="control-label" htmlFor="MenuItemName">Menu item name</label>
                        <input className="form-control" type="text" id="MenuItemName" name="MenuItemName" value={menuItemName} onChange={(e) => setMenuItemName(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="control-label" htmlFor="MenuItemDescription">Menu item description</label>
                        <input className="form-control" type="text" id="MenuItemDescription" name="MenuItemDescription" value={menuItemDescription} onChange={(e) => setMenuItemDescription(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="control-label" htmlFor="MenuItemPrice">Menu item price</label>
                        <input className="form-control" type="number" id="MenuItemPrice" name="MenuItemPrice" value={menuItemPrice} onChange={(e) => setMenuItemPrice(Number(e.target.value))} />
                    </div>
                    <div className="form-group">
                        <label className="control-label" htmlFor="PhotoLink">Photo Link</label>
                        <input className="form-control" type="text" id="PhotoLink" name="PhotoLink" value={photoLink} onChange={(e) => setPhotoLink(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="control-label" htmlFor="MenuId">Menu</label>
                        <select className="form-control" id="MenuId" name="MenuId" value={menuId} onChange={(e) => setMenuId(e.target.value)}>
                            {menus.map(menu => (
                                <option key={menu.id} value={menu.id}>{menu.menuName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="control-label" htmlFor="MenuItemCategoryId">Menu Item Category</label>
                        <select className="form-control" id="MenuItemCategoryId" name="MenuItemCategoryId" value={menuItemCategoryId} onChange={(e) => setMenuItemCategoryId(e.target.value)}>
                            <option value="">-- Select a category --</option>
                            {menuItemCategories.map(item => (
                                <option key={item.id} value={item.id}>{item.menuItemCategoryName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <button onClick={validateAndUpdate} type="submit" className="btn btn-primary" value="Create">Update</button>
                    </div>
            </div>
        </div>
    
        <div>
                <button onClick={() => router.back()} className="btn btn-secondary">Back to menu items</button>
            </div>
    </>)
}