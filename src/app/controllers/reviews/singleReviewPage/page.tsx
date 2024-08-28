"use client";

import { ICafe } from "@/domain/ICafe";
import { IReview } from "@/domain/IReview";
import { IReviewPhoto } from "@/domain/IReviewPhoto";
import CafeService from "@/services/CafeService";
import ReviewPhotoService from "@/services/ReviewPhotoService";
import ReviewService from "@/services/ReviewService";
import { GetUserInfo } from "@/state/AppContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SingleReviewPage(){
    const router = useRouter();
    const id = useSearchParams().get("id");
    const[review, setReview] = useState<IReview | null>(null);
    const [validationError, setvalidationError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const userInfo = GetUserInfo();
    const[cafes, setCafes] = useState<ICafe[]>([]);
    const[reviewPhotos, setReviewPhotos] = useState<IReviewPhoto[]>([]);
    // const[tasks, setTasks] = useState<ITask[]>([]); ///////////

    useEffect(() => {
        const loadData = async() => {
            try{
                if(id){

                    const reviewResponse = await ReviewService.getByIdWithoutUser(id);
                    // const tasksResponse = await TaskService.getAll(); //////////
                    // if(tasksResponse.data){
                    //     setTasks(tasksResponse.data);
                    // }

                    if(reviewResponse.data){
                        setReview(reviewResponse.data);
                    }

                    const cafeResponse = await CafeService.getAllCafes();
                    if(cafeResponse.data){
                        setCafes(cafeResponse.data);
                    }

                    const photoResponse = await ReviewPhotoService.getAllPhotosForReview(id);
                    if (photoResponse.data) {
                        setReviewPhotos(photoResponse.data);
                    }

                }
            }catch (error) {
                console.error('Failed to load review:', error);
            } finally {
                setIsLoading(false);
            }
        };
        // !!!!!!!!!!!!!////////
        loadData(); 
    }, [id]);


    const formatDate = (date: Date): string => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        };
        return new Intl.DateTimeFormat('en-GB', options).format(new Date(date));
    };

    const getCafeName = (cafeId: string) => {
        
        const cafe = cafes.find(cafe => (cafe.id !== undefined && cafe.id === cafeId));
        return cafe?.cafeName ?? "Unknown";
    };

    const handleAddPhoto = (reviewId: string) => {
        router.push(`/controllers/reviews/singleReviewPage/reviewPhoto/create?id=${reviewId}`);
    }

    if (isLoading) return (<h1>Loading...</h1>);
    if(!review) return (<h1>No review found</h1>);

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-4">
                    <div className="single-review-info">
                        <div className="card mb-4">
                            <div className="card-body">
                                {validationError && <div className="text-danger mb-3" role="alert">{validationError}</div>}
                                <div className="form-group">
                                    <h5 className="card-title" id="CafeName">Cafe name: {getCafeName(review.cafeId)}</h5>
                                </div>
                                <div className="form-group">
                                    <p className="card-text"><strong>Rating:</strong> {review.rating} stars</p>
                                </div>
                                <div className="form-group">
                                    {/* <p className="card-text" id="CafeAddress"><strong>User:</strong> {userInfo?.firstName} {userInfo?.lastName}</p> */}
                                </div>
                                <div className="form-group">
                                    <p className="card-text" id="CafeEmail"><strong>Text:</strong> {review.text}</p>
                                </div>
                                <div className="form-group">
                                    <p className="card-text" id="CafeTelephone"><strong>Date of experience::</strong> {formatDate(review.date)}</p>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div className="col-md-4">
                    <button onClick={() => handleAddPhoto(id!)} className="btn btn-outline-secondary btn-sm">Add photo</button>
                </div>
            </div>
            <div className="form-group">
                <p className="card-text" id="CafeWebsiteLink"><strong>Photos:</strong></p>
                {reviewPhotos.length > 0 ? (
                    <div id="photoCarousel" className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            {reviewPhotos.map((photo, index) => (
                                <div key={photo.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                    <img src={photo.reviewPhotoLink} className="d-block w-100" alt="Review Photo" style={{ height: '400px', objectFit: 'contain' }} />
                                </div>
                            ))}
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#photoCarousel" data-bs-slide="false">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#photoCarousel" data-bs-slide="false">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                ) : (
                    <p>No photos available.</p>
                )}
            </div>

            <div>
                <button onClick={() => router.back()} className="btn btn-secondary">Back to reviews list</button>
            </div>
        </div>
    );
}