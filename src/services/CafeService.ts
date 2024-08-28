import axios, { AxiosRequestConfig } from "axios";
import { IResultObject } from "./IResultObject";
import { ICafe } from "@/domain/ICafe";

export interface ICity {
    id: string;
    cityName: string;
}


export default class CafeService {
    private constructor() {

    }

    private static httpClient = axios.create({
        baseURL: '/api/v1/Cafes',
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

    static async getAll(jwt: string | null): Promise<IResultObject<ICafe[]>> {
        try {
            const response = await CafeService.httpClient.get("", this.getJwtConfig(jwt));
            if (response.status < 300) {
                return {
                    data: response.data['$values'].map((cafe: any) => ({
                        ...cafe,
                        cityName: cafe.cityName,
                    }))
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

    static async getAllCafes(): Promise<IResultObject<ICafe[]>> {
        try {
            const response = await CafeService.httpClient.get("/all");
            if (response.status < 300) {
                return {
                    data: response.data['$values'].map((cafe: any) => ({
                        ...cafe,
                        cityName: cafe.cityName,
                    }))
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

    static async create(cafeData: ICafe, jwt: string | null): Promise<IResultObject<ICafe>> {
        try {
            const response = await CafeService.httpClient
                .post<ICafe>("", cafeData, this.getJwtConfig(jwt));
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

    static async getCities(): Promise<ICity[]> {
        const response = await axios.get('/api/v1/Cities');
        return response.data.$values;
    }

    static async delete(id: string, jwt: string | null): Promise<IResultObject<void>> {
        try {
            const response = await CafeService.httpClient.delete(`/${id}`, this.getJwtConfig(jwt));
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

    static async getByIdWithoutUser(id: string): Promise<IResultObject<ICafe>> {
        try {
            const response = await CafeService.httpClient.get<ICafe>(`/${id}/withoutUser`);
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


    static async getById(id: string, jwt: string | null): Promise<IResultObject<ICafe>> {
        try {
            const response = await CafeService.httpClient.get<ICafe>(`/${id}`, this.getJwtConfig(jwt));
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

    static async update(id: string, cafeData: ICafe, jwt: string | null): Promise<IResultObject<ICafe>> {
        try {
            const response = await CafeService.httpClient.put<ICafe>(`/${id}`, cafeData, this.getJwtConfig(jwt));
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