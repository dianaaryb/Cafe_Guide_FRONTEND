"use client"

import { ICafeOccasion } from "@/domain/ICafeOccasion";
import { IOccasionOfCafe } from "@/domain/IOccasionOfCafe";
import CafeOccasionService from "@/services/CafeOccasionService";
import OccasionOfCafeService from "@/services/OccasionOfCafeService";
import { AppContext } from "@/state/AppContext";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function Create(){
    const router = useRouter();
    const[occasions, setOccasions] = useState<IOccasionOfCafe[]>([]);
    const searchParams = useSearchParams();
    const cafeIdFromUrl = searchParams.get("id") || "";
    const [cafeId, setCafeId] = useState("");
    const [validationError, setvalidationError] = useState("");
    const[occasionGuid, setOccasionGuid] = useState("");
    const{userInfo, setUserInfo} = useContext(AppContext)!;

    useEffect(() => {
        const loadData = async () => {
            try{
                const response = await OccasionOfCafeService.getAll();
                if(response.data){
                    setOccasions(response.data);
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
        if(!occasionGuid){
            setvalidationError("Type name must be set!");
            return;
        }

        const cafeOccasionData: ICafeOccasion = {
            "cafeId": cafeIdFromUrl,
            "occasionOfCafeId": occasionGuid
        }

        try{
            const result = await CafeOccasionService.create(cafeOccasionData, userInfo!.jwt);
            if(result.data){
                router.push(`/controllers/cafes/singleCafePage?id=${cafeIdFromUrl}`);
            }else if (result.errors) {
                setvalidationError(result.errors.join(", "));
            }
        }catch (error) {
            setvalidationError("Cafe occasion creation failed. Please try again later.");
        }
        };
    
        return(
     
            <>  
            <h1>Create cafe occasion</h1>
            <hr />
            <div className="row">
                <div className="col-md-4">
                <div className="text-danger" role="alert">{validationError}</div>
                <select className="form-control" id="OccasionOfCafeName" name="OccasionOfCafeName" value={occasionGuid} onChange={(e) => setOccasionGuid(e.target.value)}>
                                <option value="">-- Select a occasion --</option>
                                {occasions.map(t => (
                                    <option key={t.id} value={t.id}>{t.occasionOfCafeName}</option>
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