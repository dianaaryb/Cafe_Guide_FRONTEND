// "use client"

// import { ICafe } from "@/domain/ICafe";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { GetUserInfo } from "@/state/AppContext";
// import ReviewService from "@/services/ReviewService";
// import { IReview } from "@/domain/IReview";
// import Link from "next/link";
// import CafeService from "@/services/CafeService";

// export default function Edit() {
//     const router = useRouter();
//     const [cafes, setCafes] = useState<ICafe[]>([]);
//     const [rating, setRating] = useState<number | "">("");
//     const [text, setText] = useState("");
//     const [date, setDate] = useState<string>(new Date().toISOString().substring(0, 16));
//     const [cafeId, setCafeId] = useState("");
//     const [validationError, setvalidationError] = useState("");
//     const [isLoading, setIsLoading] = useState(true);
//     const id = useSearchParams().get("id");
//     const userInfo = GetUserInfo();
//     const [cafeName, setCafeName] = useState("");

//     useEffect(() => {
//         const loadData = async () => {
//             try {
//                 if (id) {
//                     const response = await ReviewService.getById(id, userInfo!.jwt);
//                     if (response.data) {
//                         setRating(response.data.rating);
//                         setText(response.data.text);
//                         setDate(new Date(response.data.date).toISOString().substring(0, 16));
//                         setCafeId(response.data.cafeId);
//                         // setAppUser(response.data.appUser || { firstName: "", lastName: "" });

//                         const cafeResponse = await CafeService.getAllCafes();
//                         if (cafeResponse.data) {
//                             setCafes(cafeResponse.data);
//                             const cafe = cafeResponse.data.find(cafe => cafe.id === response.data!.cafeId);
//                             if (cafe) {
//                                 setCafeName(cafe.cafeName);
//                             }
//                         }
//                     }
//                 }
//             } catch (error) {
//                 console.error('Failed to load cafes:', error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         loadData().catch(error => {
//             console.error('Failed to load data:', error);
//         });
//     }, [id, text, userInfo!.jwt]);

//     const validateAndUpdate = async () => {
//         if (!rating || !text || !date || !cafeId) {
//             setvalidationError("Rating, text, date, cafe must be set!");
//             return;
//         }

//         setvalidationError("");

//         try {
//             if (id != null) {
//                 const reviewData: IReview = {
//                     rating: Number(rating),
//                     text,
//                     date: new Date(date),
//                     appUserId: userInfo!.userId!,
//                     cafeId
//                 };

//                 const result = await ReviewService.update(id, reviewData, userInfo?.jwt!);

//                 if (result.data !== undefined) {
//                     router.push("/controllers/reviews");
//                 } else if (result.errors) {
//                     console.error('Update errors:', result.errors);
//                 } else {
//                     setvalidationError("Failed to update review");
//                 }
//             }
//         } catch (error) {
//             setvalidationError("Review update failed. Please try again later.");
//         }
//     };

//     if (isLoading) return (<h1>Loading...</h1>);

//     const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setDate(event.target.value);
//     };

//     const handleRatingChange = (value: string) => {
//         const num = Number(value);
//         if (value === "") {
//             setRating("");
//             setvalidationError("");
//         } else if (num > 0 && num <= 10) {
//             setRating(num);
//             setvalidationError("");
//         } else {
//             setvalidationError("Rating should be > 0 and <= 10");
//         }
//     };

//     return (
//         <>
//             <h1>Edit Review</h1>
//             <div className="text-danger" role="alert">{validationError}</div>
//             <div className="form-group">
//                 <label className="control-label" htmlFor="Rating">Rating</label>
//                 <input
//                     className="form-control"
//                     type="text"
//                     id="Rating"
//                     name="Rating"
//                     value={rating}
//                     onChange={(e) => handleRatingChange(e.target.value)}
//                     min={1}
//                     max={10}
//                 />
//             </div>
//             <div className="form-group">
//                 <label className="control-label" htmlFor="Text">Text</label>
//                 <input
//                     className="form-control"
//                     type="text"
//                     id="Text"
//                     name="Text"
//                     value={text}
//                     onChange={(e) => setText(e.target.value)}
//                 />
//             </div>
//             <div className="form-group">
//                 <label className="control-label" htmlFor="Date">Date</label>
//                 <input
//                     className="form-control"
//                     type="text"
//                     id="Date"
//                     name="Date"
//                     value={date}
//                     onChange={handleDateChange}
//                 />
//             </div>
//             <div className="form-group">
//                 <label className="control-label" htmlFor="CafeId">Cafe</label>
//                 <div
//                     className="form-control-plaintext"
//                     id="CafeId">
//                     {cafeName || "Cafe not found"}
//                 </div>
//             </div>
//             <div className="form-group">
//                 <button onClick={validateAndUpdate} type="submit" value="update" className="btn btn-primary">Update</button>
//             </div>
//             <Link href="../reviews">Back to List</Link>
//         </>
//     );
// }





"use client"

import { ICafe } from "@/domain/ICafe";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {GetUserInfo} from "@/state/AppContext";
import ReviewService from "@/services/ReviewService";
import { IReview } from "@/domain/IReview";
import Link from "next/link";
import CafeService from "@/services/CafeService";

export default function Edit(){
    const router = useRouter();
    const[cafes, setCafes] = useState<ICafe[]>([]);
    const[rating, setRating] = useState<number | "">("");
    const[text, setText] = useState("");
    const[date, setDate] = useState<string>(new Date().toISOString().substring(0, 16));
    const[cafeId, setCafeId] = useState("");
    const [validationError, setvalidationError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const id = useSearchParams().get("id");
    const userInfo = GetUserInfo();
    const[cafeName, setCafeName] = useState("");

    useEffect(() => {
        const loadData = async () => {
            try {
                if (text === "" && id != null) {
                    const response = await ReviewService.getById(id, userInfo!.jwt);
                    if (response.data) {
                        setRating(response.data.rating);
                        setText(response.data.text);
                        setDate(new Date(response.data.date).toISOString().substring(0, 16));
                        setCafeId(response.data.cafeId);
                        const cafeResponse = await CafeService.getAllCafes();
                        if(cafeResponse.data){
                            setCafes(cafeResponse.data);
                            const cafe = cafeResponse.data.find(cafe => cafe.id === response.data!.cafeId);
                            if (cafe) {
                                setCafeName(cafe.cafeName);
                            }
                        }
        
                    }
            
                }
            } catch (error) {
                console.error('Failed to load cafes:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData().catch(error => {
            console.error('Failed to load data:', error);
        });
            }, [id, text, userInfo!.jwt]);


        const validateAndUpdate = async() => {
            if(!rating || !text || !date || !cafeId){
                setvalidationError("Rating, text, date, cafe must be set!");
                return;
            }
    
            setvalidationError("");
    
            try {
                if (id != null) {
                    const reviewData: IReview = {
                        rating: Number(rating),
                        text, 
                        date: new Date(date),
                        appUserId: userInfo!.userId!,
                        cafeId
                    };
                    
                    const result = await ReviewService.update(id, reviewData, userInfo?.jwt!);
    
                    if (result.data !== undefined) {
                        router.push("/controllers/reviews")
    
                    } else if(result.errors){
                        console.error('Update errors:', result.errors);
                    }else {
                        setvalidationError("Failed to update cafe");
                    }
                }
            } catch (error) {
                setvalidationError("Cafe update failed. Please try again later.");
            }
        };
    
        if (isLoading) return (<h1>Loading...</h1>);

        const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            setDate(event.target.value);
        };

        const handleRatingChange = (value: string) => {
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
        
        return (
            <>
                <h1>Edit Review</h1>
                <div className="text-danger" role="alert">{validationError}</div>
                <div className="form-group">
                    <label className="control-label" htmlFor="Rating">Rating</label>
                    <input
                        className="form-control"
                        type="text"
                        id="Rating"
                        name="Rating"
                        value={rating}
                        onChange={(e) => handleRatingChange(e.target.value)}
                        min={1}
                        max={10}
                    />
                </div>
                <div className="form-group">
                    <label className="control-label" htmlFor="Text">Text</label>
                    <input
                        className="form-control"
                        type="text"
                        id="Text"
                        name="Text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label className="control-label" htmlFor="Date">Date</label>
                    <input
                        className="form-control"
                        type="text"
                        id="Date"
                        name="Date"
                        value={date}
                        onChange={handleDateChange}
                    />
                </div>
                <div className="form-group">
                <label className="control-label" htmlFor="CafeName">Cafe Name</label>
                <input
                    className="form-control"
                    type="text"
                    id="CafeName"
                    name="CafeName"
                    value={cafeName}
                    onChange={(e) => setCafeName(e.target.value )}
                    readOnly
                />
            </div>
                <div className="form-group">
                    <button onClick={validateAndUpdate} type="submit" value="update" className="btn btn-primary">Update</button>
                </div>
                <div>
                <button onClick={() => router.back()} className="btn btn-secondary">Back to reviews list</button>
            </div>
    
            </>
        );
    
        }
