import { ICafeType } from "@/domain/ICafeType";
import axios, { AxiosRequestConfig } from "axios";
import { IResultObject } from "./IResultObject";

export default class CafeTypeService{
    private constructor() {

    }

    private static httpClient = axios.create({
        baseURL: '/api/v1/CafeTypes',
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

    static async getAll(): Promise<IResultObject<ICafeType[]>> {
        try {
            const response = await CafeTypeService.httpClient.get("");
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


    static async create(cafeData: ICafeType, jwt: string | null): Promise<IResultObject<ICafeType>> {
        try {
            console.log(cafeData);
            const response = await CafeTypeService.httpClient
                .post<ICafeType>("", cafeData, this.getJwtConfig(jwt));
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