
"use client"

import { ICafe } from "@/domain/ICafe";
import { IReview } from "@/domain/IReview";
import CafeService, { ICity } from "@/services/CafeService";
import { AppContext, GetUserInfo } from "@/state/AppContext";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react"
import '/public/styles.css';
import {useRouter} from "next/navigation";
import { ICategoryOfCafe } from "@/domain/ICategoryOfCafe";
import CategoryService from "@/services/CategoryService";
import { ITypeOfCafe } from "@/domain/ITypeOfCafe";
import TypeOfCafeService from "@/services/TypeOfCafeService";
import { IOccasionOfCafe } from "@/domain/IOccasionOfCafe";
import OccasionOfCafeService from "@/services/OccasionOfCafeService";

export default function SingleCafePage(){

    const router = useRouter();
    const id = useSearchParams().get("id");
    const [cafe, setCafe] = useState<ICafe | null>(null);
    const [validationError, setvalidationError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const { userInfo } = useContext(AppContext)!;
    const [cities, setCities] = useState<ICity[]>([]);
    const [cityName, setCityName] = useState("");
    const [categoriesOfCafe, setCategoriesOfCafe] = useState<ICategoryOfCafe[]>([]);
    const[typesOfCafe, setTypesOfCafe] = useState<ITypeOfCafe[]>([]);
    const[occasionsOfCafe, setOccasionsOfCafe] = useState<IOccasionOfCafe[]>([]);


    useEffect(() => {
        const loadData = async () => {
            try {
                if (id) {
                    const token = userInfo !== null ? userInfo!.jwt : null;
                    const cafeResponse = await CafeService.getByIdWithoutUser(id); 
        
                    if (cafeResponse.data) {
                        let reviews: IReview[] = [];
                        if (cafeResponse.data.reviews && '$values' in cafeResponse.data.reviews) {
                            reviews = cafeResponse.data.reviews.$values;
                        } else if (Array.isArray(cafeResponse.data.reviews)) {
                            reviews = cafeResponse.data.reviews;
                        }
                            setCafe({
                            ...cafeResponse.data,
                            reviews: reviews 
                        });
                        const cityResponse = await CafeService.getCities();
                        setCities(cityResponse);
                        const city = cityResponse.find(city => city.id === cafeResponse.data!.cityId);
                        if (city) {
                            setCityName(city.cityName);
                        }

                        const cafeCategories = await CategoryService.getAllCategoriesForCafe(id);
                        if(cafeCategories.data){
                            setCategoriesOfCafe(cafeCategories.data);
                        }else{
                            setCategoriesOfCafe([]);
                        }

                        const cafeTypes = await TypeOfCafeService.getAllTypesForCafe(id);
                        if(cafeTypes.data){
                            setTypesOfCafe(cafeTypes.data);
                        }else{
                            setTypesOfCafe([]);
                        }

                        const cafeOccasions = await OccasionOfCafeService.getAllOccasionsForCafe(id);
                        if(cafeOccasions.data){
                            setOccasionsOfCafe(cafeOccasions.data);
                        }else{
                            setOccasionsOfCafe([]);
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to load cafe:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [id]);

    const handleCafeMenu = async (id:string) => {
        router.push(`menus/menuSpecificCafe?id=${id}`);
    }

    const handleCafeCategory = async(id: string) => {
        if(userInfo){
        router.push(`/controllers/cafes/singleCafePage/cafeCategory/create?id=${id}`)
        }else {
            router.push(`/login`);
        }
    }

    const handleCafeType = async(id: string) => {
        if(userInfo){
        router.push(`/controllers/cafes/singleCafePage/cafeType/create?id=${id}`)
        }else {
            router.push(`/login`);
        }
    }

    const handleCafeOccasion = async(id: string) => {
        if(userInfo){
        router.push(`/controllers/cafes/singleCafePage/cafeOccasion/create?id=${id}`)
        }else {
            router.push(`/login`);
        }
    }

        if (isLoading) return (<h1>Loading...</h1>);
        if(!cafe) return (<h1>No cafe found</h1>);

        const reviewCount = Array.isArray(cafe.reviews) ? cafe.reviews.length : 0;

        return (
            <div className="container mt-4">
                <div className="row">
                    {cafe.photoLink && (
                        <div className="col-md-4">
                            <div className="form-group">
                                <img src={cafe.photoLink} alt={`Photo of ${cafe.cafeName}`} className="img-fluid cafe-photo" />
                            </div>
                            <div><button onClick={() => handleCafeMenu(cafe.id!)} className="btn btn-success menu-button">Menu</button></div>
                            <div><button onClick={() => handleCafeCategory(cafe.id!)} className="btn btn-outline-success category-button">Add category</button></div>
                            <div><button onClick={() => handleCafeType(cafe.id!)} className="btn btn-outline-success type-button">Add type</button></div>
                            <div><button onClick={() => handleCafeOccasion(cafe.id!)} className="btn btn-outline-success occasion-button">Add occasion</button></div>
                        </div>
                    )}
                    <div className="col-md-4">
                        <div className="single-cafe-info">
                            <div className="card mb-4 border border-success">
                                <div className="card-body">
                                    {validationError && <div className="text-danger mb-3" role="alert">{validationError}</div>}
                                    <div className="form-group">
                                        <h5 className="card-title-cafe text-danger" id="CafeName">{cafe.cafeName}</h5>
                                    </div>
                                    <hr/>
                                    <div className="form-group">
                                        <p className="card-text"><strong>Number of reviews:</strong> {reviewCount}</p>
                                    </div>
                                    <div className="form-group">
                                        <p className="card-text" id="CafeAddress"><strong>Address:</strong> {cafe.cafeAddress}</p>
                                    </div>
                                    <div className="form-group">
                                        <p className="card-text" id="CafeEmail"><strong>Email:</strong> {cafe.cafeEmail}</p>
                                    </div>
                                    <div className="form-group">
                                        <p className="card-text" id="CafeTelephone"><strong>Telephone:</strong> {cafe.cafeTelephone}</p>
                                    </div>
                                    <div className="form-group">
                                        <p className="card-text" id="CafeWebsiteLink"><strong>Website:</strong> {cafe.cafeWebsiteLink}</p>
                                    </div>
                                    <div className="form-group">
                                        <p className="card-text" id="CafeAverageRating"><strong>Rating:</strong> {cafe.cafeAverageRating}</p>
                                    </div>
                                    <div className="form-group">
                                        <p className="card-text" id="CafeCity"><strong>City:</strong> {cityName}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-header border border-success">Reviews</div>
                                <div className="card-body border border-success">
                                    {Array.isArray(cafe.reviews) && cafe.reviews.length > 0 ? (
                                        cafe.reviews.map((review) => (
                                            <div key={review.id} className="review">
                                                <h5><strong>Rating:</strong> {review.rating} Stars</h5>
                                                <p>{review.text}</p>
                                                <p><strong>Date:</strong> {new Date(review.date).toLocaleDateString()}</p>
                                                {/* <p><strong>User:</strong> {userInfo?.firstName} {userInfo?.lastName}</p> */}
                                                <hr />
                                            </div>
                                        ))
                                    ) : (
                                        <p>No reviews available.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                            <div>
                                <div className="categories-div">
                                    <span className="border border-success p-2 d-block">
                                        <h5>Categories</h5>
                                        <hr/>
                                        <ul>
                                            {categoriesOfCafe.map(category => (
                                                <li key={category.id}>{category.categoryOfCafeName}</li>
                                            ))}
                                        </ul>
                                    </span>                               
                                </div>
                                <div className="types-div">
                                    <span className="border border-success p-2 d-block">
                                        <h5>Types</h5>
                                        <hr/>
                                        <ul>
                                            {typesOfCafe.map(type => (
                                                <li key={type.id}>{type.typeOfCafeName}</li>
                                            ))}
                                        </ul>
                                    </span>
                                </div>
                                <div className="occasions-div">
                                    <span className="border border-success p-2 d-block">
                                        <h5>Occasions</h5>
                                        <hr/>
                                        <ul>
                                            {occasionsOfCafe.map(type => (
                                                <li key={type.id}>{type.occasionOfCafeName}</li>
                                            ))}
                                        </ul>
                                    </span>
                                </div>
      
                            </div>
                    </div>
                </div>
                <div>
                <button onClick={() => router.back()} className="btn btn-secondary">Back to cafes list</button>
            </div>
            </div>
        );
}