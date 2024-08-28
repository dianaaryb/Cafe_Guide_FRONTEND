"use client"

import {useState, useContext, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { AppContext } from '@/state/AppContext';
import { ICafe } from '@/domain/ICafe';
import ReviewService from '@/services/ReviewService';
import { IReview } from '@/domain/IReview';
import Link from 'next/link';
import CafeService, { ICity } from '@/services/CafeService';

export default function Create(){
    const router = useRouter();
    const { userInfo } = useContext(AppContext)!;

    if (!userInfo) {
        // Handle the case when userInfo is not available
        router.push(`/login`);
    }

    const[cafes, setCafes] = useState<ICafe[]>([]);
    const[rating, setRating] = useState<number | "">("");
    const[text, setText] = useState("");
    const[date, setDate] = useState<string>(new Date().toISOString().substring(0, 16));
    const[cafeId, setCafeId] = useState("");
    const [validationError, setvalidationError] = useState("");
    const [cafeName, setCafeName] = useState("");

    useEffect(() => {
        const fetchCafes = async () => {
            try {
                const result = await CafeService.getAllCafes();
                if(result.data){
                    setCafes(result.data);
                }
                
            } catch (error) {
                console.error("Failed to fetch cafes:", error);
            }
        };
        fetchCafes();
    }, [])


    const validateAndCreate = async() => {
        if(!rating || !text || !date || !cafeId){
            setvalidationError("Name, address, email, telephone and city must be set!");
            return;
        }

        setvalidationError("");

        const reviewData: IReview = {
            rating: Number(rating),
            text, 
            date: new Date(date),
            appUserId: userInfo!.userId!,
            cafeId,
            // appUser: {
            //     firstName: userInfo!.firstName,
            //     lastName: userInfo!.lastName,
            // }
        };

            
        try {
            const result = await ReviewService.create(reviewData, userInfo!.jwt);
            if (result.data) {
                router.push("/controllers/reviews/")
            
            } else if (result.errors) {
                setvalidationError(result.errors.join(", "));
            }
        } catch (error) {
            setvalidationError("Review creation failed. Please try again later.");
        }
    };

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDate(event.target.value);
    };

    const handleRatingInsert = (value: string) => {
        const num = Number(value);
        if (value === "") {
            setRating("");
            setvalidationError("");
        } else if (num > 0 && num <= 10) {
            setRating(num);
            setvalidationError("");
        } else {
            setvalidationError("Rating should be > 0 and <= 10");
        }
    };

    return(
     
        <>  
        <h1>Create review</h1>
        <hr />
        <div className="row">
            <div className="col-md-4">
            <div className="text-danger" role="alert">{validationError}</div>
            {/* <div className="form-group">
                        <label className="control-label" htmlFor="FirstName">First Name</label>
                        <input className="form-control" type="text" id="FirstName" name="FirstName" value={userInfo?.firstName} readOnly />
                    </div>
                    <div className="form-group">
                        <label className="control-label" htmlFor="LastName">Last Name</label>
                        <input className="form-control" type="text" id="LastName" name="LastName" value={userInfo?.lastName} readOnly />
                    </div> */}
                    <div className="form-group">
                        <label className="control-label" htmlFor="Rating">Rating</label>
                        <input className="form-control" type="text" id="Rating" name="Rating" value={rating} onChange={(e) => handleRatingInsert(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="control-label" htmlFor="Text">Text</label>
                        <input className="form-control" type="text" id="Text" name="Text" value={text} onChange={(e) => setText(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="control-label" htmlFor="Date">Date of experience</label>
                        <input className="form-control" type="datetime-local" id="Date" name="Date" value={date} onChange={handleDateChange} />
                    </div>
                    <div className="form-group">
                        <label className="control-label" htmlFor="CafeId">Cafe</label>
                        <select className="form-control" id="CafeId" name="CafeId" value={cafeId} onChange={(e) => setCafeId(e.target.value)}>
                            <option value="">-- Select a cafe --</option>
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
                <button onClick={() => router.back()} className="btn btn-secondary">Back to reviews list</button>
            </div>
</>

 );
}