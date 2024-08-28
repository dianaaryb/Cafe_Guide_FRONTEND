import axios, { AxiosRequestConfig } from "axios";
import { IResultObject } from "./IResultObject";
import { ICafeCategory } from "@/domain/ICafeCategory";

export default class CafeCategoryService{
    private constructor() {

    }

    private static httpClient = axios.create({
        baseURL: '/api/v1/CafeCategories',
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

    static async getAll(): Promise<IResultObject<ICafeCategory[]>> {
        try {
            const response = await CafeCategoryService.httpClient.get("");
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



    static async create(cafeData: ICafeCategory, jwt: string | null): Promise<IResultObject<ICafeCategory>> {
        try {
            console.log(cafeData);
            const response = await CafeCategoryService.httpClient
                .post<ICafeCategory>("", cafeData, this.getJwtConfig(jwt));
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