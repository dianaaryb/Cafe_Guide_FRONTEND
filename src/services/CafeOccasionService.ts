import { ICafeType } from "@/domain/ICafeType";
import axios, { AxiosRequestConfig } from "axios";
import { IResultObject } from "./IResultObject";
import { ICafeOccasion } from "@/domain/ICafeOccasion";

export default class CafeOccasionService{
    private constructor() {

    }

    private static httpClient = axios.create({
        baseURL: '/api/v1/CafeOccasions',
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

    static async getAll(): Promise<IResultObject<ICafeOccasion[]>> {
        try {
            const response = await CafeOccasionService.httpClient.get("");
            if (response.status < 300) {
                return {
                    data: response.data.$values
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

    static async create(cafeData: ICafeOccasion, jwt: string | null): Promise<IResultObject<ICafeOccasion>> {
        try {
            console.log(cafeData);
            const response = await CafeOccasionService.httpClient
                .post<ICafeOccasion>("", cafeData, this.getJwtConfig(jwt));
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