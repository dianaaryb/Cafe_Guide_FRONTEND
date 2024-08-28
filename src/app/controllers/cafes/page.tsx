"use client"
import { ICafe } from "@/domain/ICafe";
import CafeService, { ICity } from "@/services/CafeService";
import { AppContext } from "@/state/AppContext";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import {useRouter} from "next/navigation";
import '/public/styles.css';

export default function Cafes() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [cafes, setCafes] = useState<ICafe[]>([]);
    const { userInfo } = useContext(AppContext)!;
    const[cities, setCities] = useState<ICity[]>([]);
    const[validationError, setvalidationError] = useState("");

    const loadData = async () => {
        try {
            const token = userInfo !== null ? userInfo.jwt : null;
            const cafeResponse = await CafeService.getAllCafes();

            if (cafeResponse.data && Array.isArray(cafeResponse.data)) {
                setCafes(cafeResponse.data);
            } else {
                setCafes([]);
            }
        } catch (error) {
            console.error('Failed to load cafes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCities = async () => {
        try {
            const fetchedCities = await CafeService.getCities();
            setCities(fetchedCities);
        } catch (error) {
            console.error("Failed to fetch cities:", error);
        }
    };

    const handleEdit = async (id: string) => {
        if (userInfo) {
            router.push(`cafes/edit?id=${id}`);
        } else {
            router.push(`/login`);
        }
    };

    const handleCreate = async() => {
        if (userInfo) {
            router.push(`cafes/create`);
        } else {
            router.push(`/login`);
        }
    }
    

    const handleCafeName = async (id: string) => {
        router.push(`cafes/singleCafePage?id=${id}`);
    }

    useEffect(() => {
        const initializeData = async () => {
            await fetchCities(); // Ensure cities are fetched first
            await loadData(); // Then load cafes
        };
        initializeData();
    }, []);

    if(isLoading) return (<h1>Cafes - loading</h1>);

    const getCityName = (cityId: string) => {
        const city = cities.find(city => city.id === cityId);
        return city?.cityName ?? "Unknown";
    };

    return (
        <div className="cafes-container">
            <h1 className="cafes-page-title">Compare best cafes in Estonia</h1>
            <p>
                
                    <button onClick={() => handleCreate()} className="btn btn-success add-cafe-button">Create new cafe</button>
                
            </p>
            <div className="cafes-list">
                {cafes.map((cafe) => (
                    <div key={cafe.id} className="row">
                        <div className="card mb-2 border border-success">
                            <div className="card-body p-2"> 
                                <div className="d-flex">
                                    <img src={cafe.photoLink} alt={`Photo of ${cafe.cafeName}`} className="cafe-photo" />
                                    <div className="ml-2">
                                        <button onClick={() => handleCafeName(cafe.id!)} className="btn btn-success btn-sm cafe-button text-danger">{cafe.cafeName}</button>
                                        <h6 className="card-subtitle mb-1 text-muted">{cafe.cityName}</h6>
                                        <p className="card-text mb-1"><strong>Address:</strong> {cafe.cafeAddress}</p>
                                        <p className="card-text mb-1"><strong>Email:</strong> {cafe.cafeEmail}</p>
                                        <p className="card-text mb-1"><strong>Telephone:</strong> {cafe.cafeTelephone}</p>
                                        <p className="card-text mb-1"><strong>Website:</strong> {cafe.cafeWebsiteLink}</p>
                                        <p className="card-text mb-1"><strong>Rating:</strong> {cafe.cafeAverageRating}</p>
                                        <p className="card-text mb-1"><strong>City:</strong> {getCityName(cafe.cityId)}</p>
                                        <div className="button-group">
                                            <button onClick={() => handleEdit(cafe.id!)} className="btn btn-outline-secondary btn-sm edit-button">Edit</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}