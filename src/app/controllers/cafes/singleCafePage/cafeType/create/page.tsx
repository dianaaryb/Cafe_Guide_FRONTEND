"use client"

import { ICafeType } from "@/domain/ICafeType";
import { ITypeOfCafe } from "@/domain/ITypeOfCafe";
import CafeTypeService from "@/services/CafeTypeService";
import TypeOfCafeService from "@/services/TypeOfCafeService";
import { AppContext } from "@/state/AppContext";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function Create(){
    const router = useRouter();
    const[types, setTypes] = useState<ITypeOfCafe[]>([]);
    const searchParams = useSearchParams();
    const cafeIdFromUrl = searchParams.get("id") || "";
    const [cafeId, setCafeId] = useState("");
    const [validationError, setvalidationError] = useState("");
    const[typeGuid, setTypeGuid] = useState("");
    const{userInfo, setUserInfo} = useContext(AppContext)!;


    useEffect(() => {
        const loadData = async () => {
            try{
                const response = await TypeOfCafeService.getAll();
                if(response.data){
                    setTypes(response.data);
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
        if(!typeGuid){
            setvalidationError("Type name must be set!");
            return;
        }

        const cafeTypeData: ICafeType = {
            "cafeId": cafeIdFromUrl,
            "typeOfCafeId": typeGuid
        }

        try{
            const result = await CafeTypeService.create(cafeTypeData, userInfo!.jwt);
            if(result.data){
                router.push(`/controllers/cafes/singleCafePage?id=${cafeIdFromUrl}`);
            }else if (result.errors) {
                setvalidationError(result.errors.join(", "));
            }
        }catch (error) {
            setvalidationError("Cafe type creation failed. Please try again later.");
        }
        };

        return(
     
            <>  
            <h1>Create cafe type</h1>
            <hr />
            <div className="row">
                <div className="col-md-4">
                <div className="text-danger" role="alert">{validationError}</div>
                <select className="form-control" id="TypeOfCafeName" name="TypeOfCafeName" value={typeGuid} onChange={(e) => setTypeGuid(e.target.value)}>
                                <option value="">-- Select a type --</option>
                                {types.map(t => (
                                    <option key={t.id} value={t.id}>{t.typeOfCafeName}</option>
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