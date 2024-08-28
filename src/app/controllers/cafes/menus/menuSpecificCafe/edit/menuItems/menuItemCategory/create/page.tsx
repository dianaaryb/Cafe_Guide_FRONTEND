"use client"

import { IMenuItemCategory } from "@/domain/IMenuItemCategory";
import MenuItemCategoryService from "@/services/MenuItemCategoryService";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Create(){
    const router = useRouter();
    const[menuItemCategoryName, setMenuItemCategoryName] = useState("");
    const [validationError, setvalidationError] = useState("");
    const[menuItemCategories, setMenuItemCategories] = useState<IMenuItemCategory[]>([]);
    const searchParams = useSearchParams();
    const menuIdFromUrl = searchParams.get("id") || "";
    const[menuId, setMenuId] = useState("");

    useEffect(() => {
        const fetchMenus = async () => {
            try{
                const result = await MenuItemCategoryService.getAll();
                if(result.data){
                    setMenuItemCategories(result.data);
                    if(menuIdFromUrl){
                        setMenuId(menuIdFromUrl);
                    }
                }
            }catch (error) {
                console.error("Failed to fetch menu item categories:", error);
            }
        };
        fetchMenus();
    }, []);

    const validateAndCreate = async() => {
        if(!menuItemCategoryName){
            setvalidationError("Menu item category name must be set!");
            return;
        }

        const menuItemCategoryData: IMenuItemCategory = {
            menuItemCategoryName
        }

        try{
            const result = await MenuItemCategoryService.create(menuItemCategoryData);
            if(result.data){
                router.push(`/controllers/cafes/menus/menuSpecificCafe/edit/menuItems?id=${menuIdFromUrl}`)

            }else if (result.errors) {
                setvalidationError(result.errors.join(", "));
            }
        }catch (error) {
            setvalidationError("Menu Item category creation failed. Please try again later.");
        }
};
return(
     
    <>  
    <h1>Create menu item category</h1>
    <hr />
    <div className="row">
        <div className="col-md-4">
        <div className="text-danger" role="alert">{validationError}</div>
                <div className="form-group">
                    <label className="control-label" htmlFor="MenuItemCategoryName">Menu item category name</label>
                    <input className="form-control" type="text" id="MenuItemCategoryName" name="MenuItemCategoryName" value={menuItemCategoryName} onChange={(e) => setMenuItemCategoryName(e.target.value)} />
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