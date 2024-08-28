
import axios, { AxiosRequestConfig } from "axios";
import { IResultObject } from "./IResultObject";
import { IOccasionOfCafe } from "@/domain/IOccasionOfCafe";

export default class OccasionOfCafeService{
    private constructor() {

    }

    private static httpClient = axios.create({
        baseURL: '/api/v1/OccasionOfCafes',
                withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    private static getJwtConfig(jwt: string | null): AxiosRequestConfig | undefined {
        return jwt ? {
            headers: {
                "Authorization": "Bearer " + jwt
            }
        } : undefined;
    }

    static async getAll(): Promise<IResultObject<IOccasionOfCafe[]>> {
        try {
            const response = await OccasionOfCafeService.httpClient.get("");
            if (response.status < 300) {
                return {
                    data: response.data.$values ?? response.data
                    }
                };
            
            return {
                errors: [response.status.toString() + " " + response.statusText]
            };
        } catch (error: any) {
            return {
                errors: [JSON.stringify(error)]
            };
        }
    }

    static async getById(id: string): Promise<IResultObject<IOccasionOfCafe>> {
        try {
            const response = await OccasionOfCafeService.httpClient.get<IOccasionOfCafe>(`/${id}`);
            if (response.status < 300) {
                return {
                    data: response.data
                }
            }
            return {
                errors: [`Error: ${response.status}. ${response.statusText}`]
            }
        } catch (error: any) {
            return {
                errors: [JSON.stringify(error)]
            };
        }
    }

    static async getAllOccasionsForCafe(cafeId: string): Promise<IResultObject<IOccasionOfCafe[]>> {
        try {
            const response = await OccasionOfCafeService.httpClient.get(`/oc/${cafeId}`);
            if (response.status < 300) {
                return {
                    data: response.data['$values']
                };
            }
            return {
                errors: [response.status.toString() + " " + response.statusText]
            };
        } catch (error: any) {
            return {
                errors: [JSON.stringify(error)]
            };
        }
    }


    static async create(cafeData: IOccasionOfCafe, jwt: string | null): Promise<IResultObject<IOccasionOfCafe>> {
        try {
            const response = await OccasionOfCafeService.httpClient
                .post<IOccasionOfCafe>("", cafeData, this.getJwtConfig(jwt));
            if (response.status === 201) {
                return {
                    data: response.data
                };
            }
            return {
                errors: [`Error: ${response.status}. ${response.statusText}`]
            }
        } catch (error: any) {
            return {
                errors: [JSON.stringify(error)]
            };
        }
    }
}