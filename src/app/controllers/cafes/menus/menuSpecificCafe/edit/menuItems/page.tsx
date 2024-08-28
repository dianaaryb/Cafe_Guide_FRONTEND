"use client"

import { IMenu } from "@/domain/IMenu";
import { IMenuItem } from "@/domain/IMenuItem";
import { IMenuItemCategory } from "@/domain/IMenuItemCategory";
import MenuItemCategoryService from "@/services/MenuItemCategoryService";
import MenuItemService from "@/services/MenuItemService";
import { AppContext } from "@/state/AppContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import '/public/styles.css';

export default function MenuItems(){
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
    const [menu, setMenu] = useState<IMenu | null>(null);
    const { userInfo } = useContext(AppContext)!;
    const menuIdFromUrl = useSearchParams().get("id");
    const[menuName, setMenuName] = useState("");
    const[menus, setMenus] = useState<IMenu[]>([]);
    const [menuItemCategories, setMenuItemCategories] = useState<IMenuItemCategory[]>([]);


    useEffect(() => {
        const loadData = async () => {
            try{
                if(menuIdFromUrl){
                    const token = userInfo !== null ? userInfo.jwt : null;
                    const response = await MenuItemService.getAllMenuItemsForMenu(menuIdFromUrl);
                    if(response.data && Array.isArray(response.data)){
                        setMenuItems(response.data);
                    }else{
                        setMenuItems([]);
                    }
                    
                    const menuResponse = await MenuItemService.getMenus();
                    setMenus(menuResponse);
                    const menu = menuResponse.find(menu => menu.id === menuIdFromUrl);
                    if(menu){
                        setMenuName(menu.menuName);
                    }
                    }
                    const categoriesResponse = await MenuItemCategoryService.getAll();
                    if (categoriesResponse.data) {
                        setMenuItemCategories(categoriesResponse.data);
                    } else {
                        setMenuItemCategories([]);
                    }

            }catch (error) {
                console.error('Failed to load reviews:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [menuIdFromUrl]);

   

    const handleEdit = async (id: string) => {
        router.push(`/controllers/cafes/menus/menuSpecificCafe/edit/menuItems/edit?id=${id}`);
    }


    const handleDelete = async (id: string) => {
        try {
            const token = userInfo !== null ? userInfo.jwt : null;
            const response = await MenuItemService.delete(id, token);
            if (response.data === undefined) {
                setMenuItems((prevItems) => prevItems.filter((item) => item.id !== id));
            }
        } catch (error) {
            console.error("Error deleting review:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleMenuItemCreate = async () => {
            router.push(`/controllers/cafes/menus/menuSpecificCafe/edit/menuItems/create?id=${menuIdFromUrl}`);
    };

    const handleMenuItemCategoryCreate = async () => {
        router.push(`/controllers/cafes/menus/menuSpecificCafe/edit/menuItems/menuItemCategory/create`);
    };

    const getCategoryName = (categoryId: string) => {
        const category = menuItemCategories.find(category => category.id === categoryId);
        return category ? category.menuItemCategoryName : 'Unknown';
    };

    if(isLoading) return (<h1>Loading</h1>);

    return (
        <>
            <div className="reviews-container">
                <div className="header mb-3">
                    <h1>MenuItems</h1>
                    <div className=" border border-success menu-categories-block">
                        <div className="categories-header">Menu Item Categories</div>
                        <ul>
                            {menuItemCategories.map(category => (
                                <li key={category.id}>{category.menuItemCategoryName}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div>
                <button onClick={handleMenuItemCreate} className="btn btn-success ">Add menu item</button>
                <button onClick={handleMenuItemCategoryCreate} className="btn btn-success add-item-button">Add menu item category</button>

                </div>
                <div className="reviews-list">
                    {menuItems.map((item) => (
                        <div key={item.id} className="col">
                            <div className="card">
                                <div className="card-body">
                                    <p className="card-title">Menu: {menuName}</p>
                                    <p className="card-text">Category: {getCategoryName(item.menuItemCategoryId)}</p>
                                    <p className="card-text">Menu item: {item.menuItemName}</p>
                                    <p className="card-text">Description: {item.menuItemDescription}</p>
                                    <p className="card-text">Price: {item.menuItemPrice} €</p>
                                    
                                    <img
                                        src={item.photoLink}
                                        alt={`Photo of ${item.menuItemName}`}
                                        className="menuItemPhoto-photo"
                                    />
                                    <div className="d-flex justify-content-end">
                                        <button onClick={() => handleEdit(item.id!)} className="btn btn-outline-secondary mr-2">Edit</button>
                                        <button onClick={() => handleDelete(item.id!)} className="btn btn-outline-danger">Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div>
                <button onClick={() => router.back()} className="btn btn-secondary">Back to menu list</button>
            </div>
            </div>
        </>
    );
}