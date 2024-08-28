
import axios, { AxiosRequestConfig } from "axios";
import { IResultObject } from "./IResultObject";
import { ITypeOfCafe } from "@/domain/ITypeOfCafe";

export default class TypeOfCafeService{
    private constructor() {

    }

    private static httpClient = axios.create({
        baseURL: '/api/v1/TypeOfCafes',
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

    static async getAll(): Promise<IResultObject<ITypeOfCafe[]>> {
        try {
            const response = await TypeOfCafeService.httpClient.get("");
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

    static async getById(id: string): Promise<IResultObject<ITypeOfCafe>> {
        try {
            const response = await TypeOfCafeService.httpClient.get<ITypeOfCafe>(`/${id}`);
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


    static async getAllTypesForCafe(cafeId: string): Promise<IResultObject<ITypeOfCafe[]>> {
        try {
            const response = await TypeOfCafeService.httpClient.get(`/typ/${cafeId}`);
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


    static async create(cafeData: ITypeOfCafe): Promise<IResultObject<ITypeOfCafe>> {
        try {
            const response = await TypeOfCafeService.httpClient
                .post<ITypeOfCafe>("", cafeData);
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