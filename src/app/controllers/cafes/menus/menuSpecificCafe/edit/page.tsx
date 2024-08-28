"use client"

import { ICafe } from "@/domain/ICafe";
import { IMenu } from "@/domain/IMenu";
import CafeService from "@/services/CafeService";
import MenuService from "@/services/MenuService";
import { AppContext } from "@/state/AppContext";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function Edit(){
    const[menus, setMenus] = useState<IMenu[]>([]);
    const [validationError, setvalidationError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const cafeIdFromUrl = useSearchParams().get("id");
    const[cafeName, setCafeName] = useState("")
    const[cafes, setCafes] = useState<ICafe[]>([]);
    const { userInfo } = useContext(AppContext)!;
    const router = useRouter();

    useEffect(() => {
        const loadData = async () => {
            try {
                if (cafeIdFromUrl) {
                    const response = await MenuService.getAllMenusForCafe(cafeIdFromUrl);
                    if (response.data) {
                        setMenus(response.data);
                    }
                    const cafeResponse = await CafeService.getAllCafes();
                    if(cafeResponse.data){
                        setCafes(cafeResponse.data);
                        const cafe = cafeResponse.data.find(cafe => cafe.id === cafeIdFromUrl);
                        if (cafe) {
                            setCafeName(cafe.cafeName);
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch menus:", error);
                setvalidationError("Failed to fetch menus.");
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [cafeIdFromUrl]);

    const handleDelete = async (id: string) => {
        try {
            const token = userInfo !== null ? userInfo.jwt : null;
            const response = await MenuService.delete(id, token);
            if (response.data === undefined) {
                setMenus((prevMenus) => prevMenus.filter((menu) => menu.id !== id));
            }
        } catch (error) {
            console.error("Error deleting review:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleMenuItemsPage = async (id: string) => {
        router.push(`/controllers/cafes/menus/menuSpecificCafe/edit/menuItems?id=${id}`)
    }

    if (isLoading) return (<h1>Loading...</h1>);

    if (validationError) {
        return <div className="text-danger">{validationError}</div>;
    }

    return (
        <>
            <h1>Edit Menus for Cafe: {cafeName}</h1>
            <hr />
            <div className="row">
                <div className="col-md-8">
                    {menus.length === 0 ? (
                        <div>No menus available for this cafe.</div>
                    ) : (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Menu Name</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {menus.map((menu) => (
                                    <tr key={menu.id}>
                                        <td>{menu.menuName}</td>
                                        <td>
                                        <button onClick={() => handleDelete(menu.id!)} className="btn btn-outline-danger">Delete</button>
                                        </td>
                                        <td><button onClick={() => handleMenuItemsPage(menu.id!)} className="btn btn-secondary">Menuitems</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            <div>
                <button onClick={() => router.back()} className="btn btn-secondary">Back to menus</button>
            </div>
        </>
    );
}


