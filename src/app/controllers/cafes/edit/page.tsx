"use client";

import CafeService, { ICity } from "@/services/CafeService";
import {ICafe} from "@/domain/ICafe";
import {GetUserInfo} from "@/state/AppContext";
import {useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import Link from "next/link";
import { ICategoryOfCafe } from "@/domain/ICategoryOfCafe";
import CategoryService from "@/services/CategoryService";


export default function Edit() {

    const router = useRouter();
    const[cafeName, setCafeName] = useState("");
    const[cafeAddress, setCafeAddress] = useState("");
    const[cafeEmail, setCafeEmail] = useState("");
    const[cafeTelephone, setCafeTelephone] = useState("");
    const[cafeWebsiteLink, setCafeWebsiteLink] = useState("");
    const[cafeAverageRating, setCafeAverageRating] = useState(0);
    const[cityId, setCityId] = useState("");
    const [validationError, setvalidationError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const id = useSearchParams().get("id");
    const userInfo = GetUserInfo();
    const [cities, setCities] = useState<ICity[]>([]);
    const[photoLink, setPhotoLink] = useState("");
    const [categoriesOfCafe, setCategoriesOfCafe] = useState<ICategoryOfCafe[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                if (id) {
                    const response = await CafeService.getByIdWithoutUser(id);
                    const categoriesResponse = await CategoryService.getAll();
                    if (response.data) {
                        setCafeName(response.data.cafeName);
                        setCafeAddress(response.data.cafeAddress);
                        setCafeEmail(response.data.cafeEmail);
                        setCafeTelephone(response.data.cafeTelephone);
                        setCafeWebsiteLink(response.data.cafeWebsiteLink);
                        setCafeAverageRating(response.data.cafeAverageRating);
                        setPhotoLink(response.data.photoLink);
                        setCityId(response.data.cityId);

                        setSelectedCategories(response.data.cafeCategories?.map(category => category.categoryOfCafeId) || []);

                    }
                    if (categoriesResponse.data) {
                        setCategoriesOfCafe(categoriesResponse.data);
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
            }, [id, userInfo!.jwt]);

    
        useEffect(() => {
            // Fetch cities when the component mounts
            const fetchCities = async () => {
                try {
                    const fetchedCities = await CafeService.getCities();
                    setCities(fetchedCities);
                } catch (error) {
                    console.error("Failed to fetch cities:", error);
                }
            };
    
            fetchCities();
        }, []);

        // const handleCategoryChange = (categoryId: string) => {
        //     setSelectedCategories(prevSelected => {
        //         if (prevSelected.includes(categoryId)) {
        //             return prevSelected.filter(id => id !== categoryId);
        //         } else {
        //             return [...prevSelected, categoryId];
        //         }
        //     });
        // };

    const validateAndUpdate = async() => {
        if(!cafeName || !cafeAddress || !cafeEmail || !cafeTelephone || !cityId){
            setvalidationError("Name, address, email, telephone and city must be set!");
            return;
        }

        setvalidationError("");

        try {
            if (id != null) {
                const cafe: ICafe = {
                    id,
                    cafeName, 
                    cafeAddress, 
                    cafeEmail, 
                    cafeTelephone,
                    cafeWebsiteLink, 
                    cafeAverageRating: Number(cafeAverageRating), 
                    photoLink,
                    cityId, 
                    appUserId: userInfo!.userId,
                    cafeCategories: selectedCategories.map(categoryId => ({ cafeId: id, categoryOfCafeId: categoryId }))
                };
                
                const result = await CafeService.update(id, cafe, userInfo?.jwt!);

                if (result.data !== undefined) {
                    router.push("/controllers/cafes")

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

    return (
        <>
            <h1>Edit Cafe</h1>
            <div className="text-danger" role="alert">{validationError}</div>
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
                <label className="control-label" htmlFor="CafeAddress">Cafe Address</label>
                <input
                    className="form-control"
                    type="text"
                    id="CafeAddress"
                    name="CafeAddress"
                    value={cafeAddress}
                    onChange={(e) => setCafeAddress(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label className="control-label" htmlFor="CafeEmail">Cafe Email</label>
                <input
                    className="form-control"
                    type="text"
                    id="CafeEmail"
                    name="CafeEmail"
                    value={cafeEmail}
                    onChange={(e) => setCafeEmail(e.target.value )}
                />
            </div>
            <div className="form-group">
                <label className="control-label" htmlFor="CafeTelephone">Cafe Telephone</label>
                <input
                    className="form-control"
                    type="text"
                    id="CafeTelephone"
                    name="CafeTelephone"
                    value={cafeTelephone}
                    onChange={(e) => setCafeTelephone(e.target.value )}
                />
            </div>
            <div className="form-group">
                <label className="control-label" htmlFor="CafeWebsiteLink">Cafe Website Link</label>
                <input
                    className="form-control"
                    type="text"
                    id="CafeWebsiteLink"
                    name="CafeWebsiteLink"
                    value={cafeWebsiteLink}
                    onChange={(e) => setCafeWebsiteLink(e.target.value )}
                />
            </div>
            <div className="form-group">
                <label className="control-label" htmlFor="CafeAverageRating">Cafe Average Rating</label>
                <input
                    className="form-control"
                    type="number"
                    id="CafeAverageRating"
                    name="CafeAverageRating"
                    value={cafeAverageRating}
                    onChange={(e) => setCafeAverageRating(Number(e.target.value) )}
                />
            </div>
            <div className="form-group">
                <label className="control-label" htmlFor="PhotoLink">Photo Link</label>
                <input
                    className="form-control"
                    type="text"
                    id="PhotoLink"
                    name="PhotoLink"
                    value={photoLink}
                    onChange={(e) => setPhotoLink(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label className="control-label" htmlFor="CityId">City</label>
                <select
                    className="form-control"
                    id="CityId"
                    name="CityId"
                    value={cityId}
                    onChange={(e) => setCityId(e.target.value )}
                >
                    <option value="">-- Select a city --</option>
                    {cities.map((city) => (
                        <option key={city.id} value={city.id}>{city.cityName}</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <button onClick={validateAndUpdate} type="submit" value="update" className="btn btn-primary">Update</button>
            </div>
            <Link href="../cafes">Back to List</Link>

        </>
    );

    }