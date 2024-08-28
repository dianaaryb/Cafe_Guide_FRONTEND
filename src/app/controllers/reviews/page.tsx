"use client";
import { ICafe } from "@/domain/ICafe";
import { IReview } from "@/domain/IReview";
import ReviewService from "@/services/ReviewService";
import { AppContext } from "@/state/AppContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import '/public/styles.css';
import CafeService from "@/services/CafeService";
import { IResultObject } from "@/services/IResultObject";

export default function Reviews() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [reviews, setReviews] = useState<IReview[]>([]);
    const { userInfo } = useContext(AppContext)!;
    const [cafes, setCafes] = useState<ICafe[]>([]);

    const loadData = async () => {
        try {
            const token = userInfo !== null ? userInfo.jwt : null;
            const response = await ReviewService.getAll();

            if (response.data && Array.isArray(response.data)) {
                setReviews(response.data);
            } else {
                setReviews([]);
            }
        } catch (error) {
            console.error('Failed to load reviews:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCafes = async () => {
        try {
            const fetchedCafes: IResultObject<ICafe[]> = await CafeService.getAllCafes();
            if (fetchedCafes.data) {
                setCafes(fetchedCafes.data);
            }
        } catch (error) {
            console.error("Failed to fetch cafes:", error);
        }
    };

    const handleEdit = async (id: string) => {
        if (userInfo) {
            router.push(`reviews/edit?id=${id}`);
        } else {
            router.push(`/login`);
        }
    }

    const handleDelete = async (id: string) => {
        try {
            if (userInfo) {
                const token = userInfo !== null ? userInfo.jwt : null;
                const response = await ReviewService.delete(id, token);
                if (response.data === undefined) {
                    setReviews((prevReviews) => prevReviews.filter((review) => review.id !== id));
                }
            } else {
                router.push(`/login`);
            }

        } catch (error) {
            console.error("Error deleting review:", error);
        } finally {
            setIsLoading(false);
        }
    }

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

    useEffect(() => {
        const initializeData = async () => {
            await fetchCafes(); // Ensure cities are fetched first
            await loadData(); // Then load cafes
        };
        initializeData();
    }, []);

    if (isLoading) return (<h1>Reviews - loading</h1>);

    const getCafeName = (cafeId: string) => {
        const cafe = cafes.find(cafe => (cafe.id !== undefined && cafe.id === cafeId));
        return cafe?.cafeName ?? "Unknown";
    };

    const handleReviewName = async (id: string) => {
        router.push(`reviews/singleReviewPage?id=${id}`);
    }

    return (
        <>
            <div className="reviews-container">
                <div className="header mb-3">
                    <h1>Reviews</h1>
                    <Link href="/controllers/reviews/create/">
                        <button className="btn btn-success">Create new review</button>
                    </Link>
                </div>
                <div className="reviews-list">
                    {reviews.map((item) => (
                        <div key={item.id} className="col">
                            <div className="card border border-success">
                                <div className="card-body">
                                    <div className="d-flex align-items-center mb-3">
                                        <div>
                                            <button onClick={() => handleReviewName(item.id!)} className="btn btn-success btn-sm cafe-button text-danger">Review for: {getCafeName(item.cafeId)}</button>
                                            <hr />
                                            <div className="text-muted border border-warning">{item.rating} STARS</div>
                                        </div>
                                    </div>
                                    {/* <h6 className="card-subtitle mb-2 text-muted">User: {item.appUser?.firstName} {item.appUser?.lastName}</h6> */}
                                    <p className="card-text">{item.text}</p>
                                    <p className="card-text"><small className="text-muted">Date of experience: {formatDate(item.date)}</small></p>
                                    <div className="d-flex justify-content-end">
                                        <button onClick={() => handleEdit(item.id!)} className="btn btn-outline-secondary mr-2">Edit</button>
                                        {/* <button onClick={() => handleDelete(item.id!)} className="btn btn-outline-danger">Delete</button> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}








// "use client"
// import { ICafe } from "@/domain/ICafe";
// import { IReview } from "@/domain/IReview";
// import ReviewService from "@/services/ReviewService";
// import { AppContext } from "@/state/AppContext";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useContext, useEffect, useState } from "react";
// import '/public/styles.css';
// import CafeService from "@/services/CafeService";
// import { IResultObject } from "@/services/IResultObject";


// export default function Reviews() {
//     const router = useRouter();
//     const [isLoading, setIsLoading] = useState(true);
//     const [reviews, setReviews] = useState<IReview[]>([]);
//     const { userInfo } = useContext(AppContext)!;
//     const[cafes, setCafes] = useState<ICafe[]>([]);

//     const loadData = async () => {
//         try {
//             const token = userInfo !== null ? userInfo.jwt : null;
//             const response = await ReviewService.getAll(token);

//             if (response.data && Array.isArray(response.data)) {
//                 setReviews(response.data);
//             } else {
//                 setReviews([]); 
//             }
//         } catch (error) {
//             console.error('Failed to load reviews:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const fetchCafes = async () => {
//         try {
//             const fetchedCafes: IResultObject<ICafe[]> = await CafeService.getAllCafes();
//             if(fetchedCafes.data){
//                 setCafes(fetchedCafes.data);
//             }
//         } catch (error) {
//             console.error("Failed to fetch cafes:", error);
//         }
//     };

//     const handleEdit = async (id: string) => {
//         if(userInfo){
//             router.push(`reviews/edit?id=${id}`);
//         }else{
//             router.push(`/login`);
//         }
        
//     }


//     const handleDelete = async (id: string) => {
//         try {
//             if(userInfo){
//                 const token = userInfo !== null ? userInfo.jwt : null;
//                 const response = await ReviewService.delete(id, token);
//                 if (response.data === undefined) {
//                     setReviews((prevReviews) => prevReviews.filter((review) => review.id !== id));
//                 }
//             }else{
//                 router.push(`/login`);
//             }
            
//         } catch (error) {
//             console.error("Error deleting review:", error);
//         } finally {
//             setIsLoading(false);
//         }
//     }
    

//     const formatDate = (date: Date): string => {
//         const options: Intl.DateTimeFormatOptions = {
//             year: 'numeric',
//             month: '2-digit',
//             day: '2-digit',
//             hour: '2-digit',
//             minute: '2-digit',
//             hour12: false,
//         };
//         return new Intl.DateTimeFormat('en-GB', options).format(new Date(date));
//     };

//     useEffect(() => {
//         const initializeData = async () => {
//             await fetchCafes(); // Ensure cities are fetched first
//             await loadData(); // Then load cafes
//         };
//         initializeData();
//     }, []);

//     if(isLoading) return (<h1>Reviews - loading</h1>);

//     const getCafeName = (cafeId: string) => {
        
//         const cafe = cafes.find(cafe => (cafe.id !== undefined && cafe.id === cafeId));
//         return cafe?.cafeName ?? "Unknown";
//     };

//     const handleReviewName = async (id:string) => {
//         router.push(`reviews/singleReviewPage?id=${id}`);
//     }



//     return (
//         <>
//             <div className="reviews-container">
//                 <div className="header mb-3">
//                     <h1>Reviews</h1>
//                     <Link href="/controllers/reviews/create/">
//                         <button className="btn btn-success">Create new review</button>
//                     </Link>
//                 </div>
//                 <div className="reviews-list">
//                     {reviews.map((item) => (
//                         <div key={item.id} className="col">
//                             <div className="card border border-success">
//                                 <div className="card-body">
//                                     <div className="d-flex align-items-center mb-3">
//                                         <div>
//                                             <button onClick={() => handleReviewName(item.id!)} className="btn btn-success btn-sm cafe-button text-danger">Review for: {getCafeName(item.cafeId)}</button>
//                                             {/* <h5 className="card-title mb-0">{getCafeName(item.cafeId)}</h5> */}
//                                             <hr/>
//                                             <div className="text-muted border border-warning">{item.rating} STARS</div>
//                                         </div>
//                                     </div>
//                                     <h6 className="card-subtitle mb-2 text-muted">User: {item.appUser?.firstName} {item.appUser?.lastName}</h6>
//                                     <p className="card-text">{item.text}</p>
//                                     <p className="card-text"><small className="text-muted">Date of experience: {formatDate(item.date)}</small></p>
//                                     <div className="d-flex justify-content-end">
//                                         {/* <button onClick={() => handleEdit(item.id!)} className="btn btn-outline-secondary mr-2">Edit</button> */}
//                                         {/* <button onClick={() => handleDelete(item.id!)} className="btn btn-outline-danger">Delete</button> */}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </>
//     );
// }