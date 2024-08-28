import { ICategoryOfCafe } from "@/domain/ICategoryOfCafe";
import axios, { AxiosRequestConfig } from "axios";
import { IResultObject } from "./IResultObject";

export default class CategoryService{
    private constructor() {

    }

    private static httpClient = axios.create({
        baseURL: '/api/v1/CategoryOfCafes',
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


    static async getAll(): Promise<IResultObject<ICategoryOfCafe[]>> {
        try {
            const response = await CategoryService.httpClient.get("");
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

    static async getById(id: string): Promise<IResultObject<ICategoryOfCafe>> {
        try {
            const response = await CategoryService.httpClient.get<ICategoryOfCafe>(`/${id}`);
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

    static async getAllCategoriesForCafe(cafeId: string): Promise<IResultObject<ICategoryOfCafe[]>> {
        try {
            const response = await CategoryService.httpClient.get(`/cat/${cafeId}`);
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


    static async create(cafeData: ICategoryOfCafe): Promise<IResultObject<ICategoryOfCafe>> {
        try {
            const response = await CategoryService.httpClient
                .post<ICategoryOfCafe>("", cafeData);
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