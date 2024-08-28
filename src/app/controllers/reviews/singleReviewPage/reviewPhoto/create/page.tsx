"use client"

import { IReview } from "@/domain/IReview";
import { IReviewPhoto } from "@/domain/IReviewPhoto";
import ReviewPhotoService from "@/services/ReviewPhotoService";
import ReviewService from "@/services/ReviewService";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Create(){
    // return( <>On create page</> )
    const router = useRouter();
    const searchParams = useSearchParams();
    const reviewIdFromUrl = searchParams.get("id") || "";
    const[reviewId, setReviewId] = useState("");
    const[reviewPhotoLink, setReviewPhotoLink] = useState("");
    const [validationError, setvalidationError] = useState("");
    const[reviews, setReviews] = useState<IReview[]>([]);
    const[cafeName, setCafeName] = useState("");

    // useEffect(() => {
    //     if (reviewIdFromUrl) {
    //         setReviewId(reviewIdFromUrl);
    //     }
    // }, [reviewIdFromUrl]);

    useEffect(() => {
        const loadData = async () => {
            try{
                const result = await ReviewService.getAll();
                if(result.data){
                    setReviews(result.data);
                    if(reviewIdFromUrl){
                        setReviewId(reviewIdFromUrl);
                        const review = result.data.find(review => review.id === reviewIdFromUrl);
                        if(review){
                            setCafeName(review.cafeName!);
                        }
                    }
                }
            }catch (error) {
                console.error("Failed to fetch data", error);
            }
        };
        loadData();
    }, [reviewIdFromUrl]);

    const validateAndCreate = async() => {
        if(!reviewPhotoLink){
            setvalidationError("Photo link must be set!");
            return;
        }
    
    

    const photoData: IReviewPhoto = {
        reviewPhotoLink,
        reviewId: reviewIdFromUrl
    };

    try{
        const result = await ReviewPhotoService.create(photoData);
        if(result.data){
            router.push(`/controllers/reviews/singleReviewPage?id=${reviewId}`);        
        }else if (result.errors) {
            setvalidationError(result.errors.join(", "));
        }
    }catch (error) {
        setvalidationError("Photo creation failed. Please try again later.");
    }}

    return (
        <>
            <h1>Add Photo</h1>
            <hr />
            <div className="row">
                <div className="text-danger" role="alert">{validationError}</div>
                <div className="form-group">
                    <label htmlFor="ReviewPhotoLink">Photo Link</label>
                    <input
                        type="text"
                        className="form-control"
                        id="ReviewPhotoLink"
                        value={reviewPhotoLink}
                        onChange={(e) => setReviewPhotoLink(e.target.value)}
                    />
                </div>
                {/* <div className="form-group">
                    <label htmlFor="ReviewId">Review for Cafe: </label>
                    <select className="form-control" id="ReviewId" name="ReviewId" value={reviewId} onChange={(e) => setReviewId(e.target.value)}>
                        {reviews.map(r => (
                            <option key={r.id} value={r.id}>{r.cafeName}</option>
                        ))}
                    </select>
                </div> */}
                <div className="form-group">
                    <button onClick={validateAndCreate} type="submit" className="btn btn-primary">
                        Create
                    </button>
                </div>
            </div>
            <div>
            <div>
                <button onClick={() => router.back()} className="btn btn-secondary">Back to review</button>
            </div>
            </div>
        </>
    );
 

}

