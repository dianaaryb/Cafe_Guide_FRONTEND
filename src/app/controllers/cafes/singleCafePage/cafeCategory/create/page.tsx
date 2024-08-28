"use client"

import { ICafeCategory } from "@/domain/ICafeCategory";
import { ICategoryOfCafe } from "@/domain/ICategoryOfCafe";
import CafeCategoryService from "@/services/CafeCategoryService";
import CategoryService from "@/services/CategoryService";
import { AppContext } from "@/state/AppContext";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function Create(){
    const router = useRouter();
    const[categories, setCategories] = useState<ICategoryOfCafe[]>([]);
    const searchParams = useSearchParams();
    const cafeIdFromUrl = searchParams.get("id") || "";
    const [cafeId, setCafeId] = useState("");
    const [validationError, setvalidationError] = useState("");
    const[categoryGuid, setCategoryGuid] = useState("");
    const{userInfo, setUserInfo} = useContext(AppContext)!;


    useEffect(() => {
        const loadData = async () => {
            try{
                const response = await CategoryService.getAll();
                if(response.data){
                    setCategories(response.data);
                    if(cafeIdFromUrl){
                        setCafeId(cafeIdFromUrl);
                    }
                }
            }catch
            (error) {
                console.error("Failed to fetch menu item categories:", error);
            }
        };
        loadData();
    }, [cafeIdFromUrl]);

    const validateAndCreate = async() => {
        if(!categoryGuid){
            setvalidationError("Category name must be set!");
            return;
        }
    
    const cafeCategoryData: ICafeCategory = {
        "cafeId": cafeIdFromUrl,
        "categoryOfCafeId": categoryGuid
    }

    try{
        const result = await CafeCategoryService.create(cafeCategoryData, userInfo!.jwt);
        if(result.data){
            router.push(`/controllers/cafes/singleCafePage?id=${cafeIdFromUrl}`);
        }else if (result.errors) {
            setvalidationError(result.errors.join(", "));
        }
    }catch (error) {
        setvalidationError("Cafe category creation failed. Please try again later.");
    }
    


    };

    return(
     
        <>  
        <h1>Create cafe category</h1>
        <hr />
        <div className="row">
            <div className="col-md-4">
            <div className="text-danger" role="alert">{validationError}</div>
            <select className="form-control" id="CategoryOfCafeName" name="CategoryOfCafeName" value={categoryGuid} onChange={(e) => setCategoryGuid(e.target.value)}>
                            <option value="">-- Select a category --</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.categoryOfCafeName}</option>
                            ))}
                        </select>
                    {/* <div className="form-group">
                        <label className="control-label" htmlFor="CategoryOfCafeName">Category name</label>
                        <input className="form-control" type="text" id="CategoryOfCafeName" name="CategoryOfCafeName" value={categoryGuid} onChange={(e) => setCategoryGuid(e.target.value)} />
                    </div> */}
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