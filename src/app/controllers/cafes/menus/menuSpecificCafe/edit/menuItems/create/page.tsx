"use client"

import { IMenu } from "@/domain/IMenu";
import { IMenuItem } from "@/domain/IMenuItem";
import { IMenuItemCategory } from "@/domain/IMenuItemCategory";
import MenuItemCategoryService from "@/services/MenuItemCategoryService";
import MenuItemService from "@/services/MenuItemService";
import MenuService from "@/services/MenuService";
import { AppContext } from "@/state/AppContext";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function Create(){
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
    const menuIdFromUrl = searchParams.get("id") || "";
    const[menuItemCategories, setMenuItemCategories] = useState<IMenuItemCategory[]>([])

    // if (!context || !context.userInfo) {
    //     // Handle the case when userInfo is not available
    //     return <div>Please log in</div>;
    // }

    // const { userInfo } = context;

    // if (!userInfo.userId) {
    //     // Handle the case when userId is not available
    //     return <div>User ID is not available</div>;
    // }

    useEffect(() => {
        const fetchData = async () => {
            try {
                    const menusResult = await MenuService.getAllMenus();
                    if(menusResult.data){
                        setMenus(menusResult.data);
                        if (menuIdFromUrl) {
                            setMenuId(menuIdFromUrl);
                            const menu = menusResult.data.find(menu => menu.id === menuIdFromUrl);
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
                
            } catch (error) {
                console.error("Failed to fetch cafes:", error);
            }
        };
        fetchData();
    }, [menuIdFromUrl])

    const validateAndCreate = async() => {
        if(!menuItemName || !menuItemPrice || !menuItemCategoryId){
            setvalidationError("Menu item name, category and price must be set!");
            return;
        }

        const menuItemData: IMenuItem = {
            menuItemName,
            menuItemDescription,
            menuItemPrice: Number(menuItemPrice),
            photoLink,
            menuItemCategoryId,
            menuId
        }

        try {
            const result = await MenuItemService.create(menuItemData);
            if (result.data) {
                router.push(`/controllers/cafes/menus/menuSpecificCafe/edit/menuItems?id=${menuIdFromUrl}`)
            
            } else if (result.errors) {
                setvalidationError(result.errors.join(", "));
            }
        } catch (error) {
            setvalidationError("Review creation failed. Please try again later.");
        }
    };

    return(
     
        <>  
        <h1>Create menu item</h1>
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
                <label className="control-label" htmlFor="MenuId">Menu name</label>
                <input
                    className="form-control"
                    type="text"
                    id="MenuId"
                    name="MenuId"
                    value={menuName}
                    onChange={(e) => setMenuName(e.target.value )}
                    readOnly
                />
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
                        <button onClick={validateAndCreate} type="submit" className="btn btn-primary" value="Create">Create</button>
                    </div>
            </div>
        </div>
    
        <div>
                <button onClick={() => router.back()} className="btn btn-secondary">Back to menu items</button>
            </div>
    </>)

}