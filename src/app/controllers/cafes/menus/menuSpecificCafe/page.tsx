"use client"

import { ICafe } from "@/domain/ICafe";
import { IMenu } from "@/domain/IMenu";
import CafeService from "@/services/CafeService";
import MenuService from "@/services/MenuService";
import { AppContext } from "@/state/AppContext";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import '/public/styles.css';

export default function MenuSpecificCafe(){
    const router = useRouter();
    const id = useSearchParams().get("id");
    const [menu, setMenu] = useState<IMenu[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cafe, setCafe] = useState<ICafe | null>(null);
    const[cafeName, setCafeName] = useState("")
    const { userInfo } = useContext(AppContext)!;

    useEffect(() => {
        const loadData = async () => {
            try{
                if(id){
                    const response = await MenuService.getAllMenusForCafe(id);
                    if(response.data){
                        setMenu(response.data);
                    }
                    const cafeResponse = await CafeService.getByIdWithoutUser(id);
                    if (cafeResponse.data) {
                        setCafe(cafeResponse.data);
                        setCafeName(cafeResponse.data.cafeName);

                    }
                }
            }catch (error) {
                console.error('Failed to load menu or cafe:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData().catch(error => { 
            console.error('Failed to load data:', error);
        });

    }, [id]);

    const handleEditMenu = async (id: string) => {
        if(userInfo){
            router.push(`/controllers/cafes/menus/menuSpecificCafe/edit?id=${id}`);
        }else{
            router.push(`/login`);
        }
       
    }

    const handleCafeCreateMenu = async (id: string) => {
        if(userInfo){
            router.push(`/controllers/cafes/menus/menuSpecificCafe/create?id=${id}`);
        }else{
            router.push(`/login`);
        }
        
    }

    if (isLoading) return (<h1>Loading...</h1>);
    if(!menu) return (<h1>No menu found</h1>);

    return (
        <>
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-8">
                    <div className="single-cafe-menu ">
                        <div className="card border border-success">
                            <div className="card-header">Menus for cafe: {cafeName}</div>
                            <p>
                                
                                <button onClick={() => handleCafeCreateMenu(cafe?.id!)} className="btn btn-success add-cafe-button">Create new menu</button>
                                <button onClick={() => handleEditMenu(cafe?.id!)} className="btn btn-success edit-menu-button">Edit menu</button>
                               
                            </p>
                            <div className="card-body">
                                {menu.map((menu) => (
                                        <div key={menu.id} className="menu">
                                            <h5><strong>Menu name:</strong> {menu.menuName}</h5>
                                            <hr />
                                        </div>
                                    ))
                                }
                            </div>
                           
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <Link href={`/controllers/cafes/singleCafePage?id=${id}`} className="btn btn-secondary">Back to cafe</Link>
            </div>
        </div>

        </>
    );
}