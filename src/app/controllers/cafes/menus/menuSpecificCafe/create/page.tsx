"use client"

import { ICafe } from "@/domain/ICafe";
import { IMenu } from "@/domain/IMenu";
import CafeService from "@/services/CafeService";
import MenuService from "@/services/MenuService";
import { AppContext } from "@/state/AppContext";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function Create(){
    const router = useRouter();
    const context = useContext(AppContext);
    const[cafes, setCafes] = useState<ICafe[]>([]);
    const[menuName, setMenuName] = useState("");
    const [validationError, setvalidationError] = useState("");
    const[cafeId, setCafeId] = useState("");
    const[cafeName, setCafeName] = useState("");
    const searchParams = useSearchParams();
    const cafeIdFromUrl = searchParams.get("id") || "";

    if (!context || !context.userInfo) {
        // Handle the case when userInfo is not available
        return <div>User info is not available</div>;
    }

    const { userInfo } = context;

    if (!userInfo.userId) {
        // Handle the case when userId is not available
        return <div>User ID is not available</div>;
    }

    // const cafeIdNew = useSearchParams().get("id");


    useEffect(() => {
        const fetchCafes = async () => {
            try {
                const result = await CafeService.getAllCafes();
                if(result.data){
                    setCafes(result.data);
                    if (cafeIdFromUrl) {
                        setCafeId(cafeIdFromUrl);
                        const cafe = result.data.find(cafe => cafe.id === cafeIdFromUrl);
                        if (cafe) {
                            setCafeName(cafe.cafeName);
                        }
                    }
                    // const cafe = result.data.find(cafe => cafe.id === cafeId);
                    // if (cafe) {
                    //     setCafeName(cafe.cafeName);
                    // }
                }
                
            } catch (error) {
                console.error("Failed to fetch cafes:", error);
            }
        };
        fetchCafes();
    }, [cafeIdFromUrl])

    const validateAndCreate = async() => {
        if(!menuName){
            setvalidationError("Menu name must be set!");
            return;
        }

    console.log(cafeId);

    const menuData: IMenu = {
        menuName,
        cafeId
    };

    console.log(menuData);

    try{
        const result = await MenuService.create(menuData, userInfo.jwt);
        if(result.data){
            router.push(`/controllers/cafes/menus/menuSpecificCafe?id=${cafeId}`)
        }else if(result.errors){
            setvalidationError(result.errors.join(", "));
        }
    }    catch (error) {
        setvalidationError("Review creation failed. Please try again later.");
    }
};

return(
     
    <>  
    <h1>Create menu</h1>
    <hr />
    <div className="row">
        <div className="col-md-4">
        <div className="text-danger" role="alert">{validationError}</div>
                <div className="form-group">
                    <label className="control-label" htmlFor="MenuName">Menu name</label>
                    <input className="form-control" type="text" id="Rating" name="Rating" value={menuName} onChange={(e) => setMenuName(e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="control-label" htmlFor="CafeId">Cafe</label>
                    <select className="form-control" id="CafeId" name="CafeId" value={cafeId} onChange={(e) => setCafeId(e.target.value)}>
                        {cafes.map(cafe => (
                            <option key={cafe.id} value={cafe.id}>{cafe.cafeName}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <button onClick={validateAndCreate} type="submit" className="btn btn-primary" value="Create">Create</button>
                </div>
        </div>
    </div>

    <div>
                <button onClick={() => router.back()} className="btn btn-secondary">Back to cafe</button>
            </div>
</>)

}