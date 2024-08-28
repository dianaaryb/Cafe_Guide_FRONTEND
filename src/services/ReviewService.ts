
import axios, { AxiosRequestConfig } from "axios";
import { IResultObject } from "./IResultObject";
import { IReview } from "@/domain/IReview";
import { ICafe } from "@/domain/ICafe";

export default class ReviewService {
    private constructor() {

    }

    private static httpClient = axios.create({
        baseURL: '/api/v1/Reviews',
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

    static async getCafes(): Promise<ICafe[]> {
        const response = await axios.get('/api/v1/Cafes');
        return response.data.$values;
    }

    static async getAll(): Promise<IResultObject<IReview[]>> {
        try {
            const response = await ReviewService.httpClient.get("");
            if (response.status < 300) {
                return {
                    data: response.data['$values']
                    };
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

    static async create(reviewData: IReview, jwt: string | null): Promise<IResultObject<IReview>> {
        try {
            const response = await ReviewService.httpClient
                .post<IReview>("", reviewData, this.getJwtConfig(jwt));
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

    static async delete(id: string, jwt: string | null): Promise<IResultObject<void>> {
        try {
            const response = await ReviewService.httpClient.delete(`/${id}`, this.getJwtConfig(jwt));
            if (response.status === 204) {
                return {
                    data: undefined,
                };
            }
            return {
                errors: [`Error: ${response.status}. ${response.statusText}`],
            };
        } catch (error: any) {
            return {
                errors: [JSON.stringify(error)],
            };
        }
    }

    static async getById(id: string, jwt: string | null): Promise<IResultObject<IReview>> {
        try {
            const response = await ReviewService.httpClient.get<IReview>(`/${id}`, this.getJwtConfig(jwt));
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


    static async getByIdWithoutUser(id: string): Promise<IResultObject<IReview>> {
        try {
            const response = await ReviewService.httpClient.get<IReview>(`/${id}/withoutUser`);
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

    static async update(id: string, reviewData: IReview, jwt: string | null): Promise<IResultObject<IReview>> {
        try {
            const response = await ReviewService.httpClient.put<IReview>(`/${id}`, reviewData, this.getJwtConfig(jwt));
            if (response.status < 300) {
                return {
                    data: response.data,
                };
            }
            return {
                errors: [`Error: ${response.status}. ${response.statusText}`],
            };
        } catch (error: any) {
            return {
                errors: [JSON.stringify(error)],
            };
        }
    }
}

    