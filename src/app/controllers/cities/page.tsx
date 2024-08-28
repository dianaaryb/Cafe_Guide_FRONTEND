"use client"
import { ICafe } from "@/domain/ICafe";
import { ICity } from "@/domain/ICity";
import CafeService from "@/services/CafeService";
import CityService from "@/services/CityService";
import { AppContext } from "@/state/AppContext";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";


export default function Cities() {
    const [isLoading, setIsLoading] = useState(true);
    const [cities, setCities] = useState<ICity[]>([]);
    const { userInfo } = useContext(AppContext)!;

    const loadData = async () => {
        try {
            const token = userInfo !== null ? userInfo.jwt : null;
            const response = await CityService.getAll(token);

            if (response.data && Array.isArray(response.data)) {
                const sortedCities = response.data.sort((a, b) => a.cityName.localeCompare(b.cityName));
                setCities(sortedCities);
            } else {
                setCities([]);  // Ensure cafes is always an array
            }
        } catch (error) {
            console.error('Failed to load citieafes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadData() }, []);

    if(isLoading) return (<h1>Cities - loading</h1>);

    return (
        <>
        <h1>Cities</h1>
        <table className="table">
            <thead>
                <tr>
                    <th>CityName</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {cities.map((item) => (
                    <tr key={item.id}>
                        <td>
                            {item.cityName}
                        </td>
                    </tr>
                ))}

            </tbody>
        </table></>
    );
}