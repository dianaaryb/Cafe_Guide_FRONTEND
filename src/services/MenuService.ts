import { IMenu } from "@/domain/IMenu";
import axios, { AxiosRequestConfig } from "axios";
import { IResultObject } from "./IResultObject";

export default class MenuService{
    private constructor() {

    }

    private static httpClient = axios.create({
        baseURL: '/api/v1/Menus',
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

    static async getAll(jwt: string | null): Promise<IResultObject<IMenu[]>> {
        try {
            const response = await MenuService.httpClient.get("", this.getJwtConfig(jwt));
            if (response.status < 300) {
                return {
                    data: response.data['$values']
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

    static async getAllMenus(): Promise<IResultObject<IMenu[]>> {
        try {
            const response = await MenuService.httpClient.get("/all");
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


    static async getAllMenusForCafe(cafeId: string): Promise<IResultObject<IMenu[]>> {
        try {
            const response = await MenuService.httpClient.get(`/all/${cafeId}`);
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

    static async create(menuData: IMenu, jwt: string | null): Promise<IResultObject<IMenu>> {
        
        try {
            const response = await MenuService.httpClient
                .post<IMenu>("", menuData, this.getJwtConfig(jwt));
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
            const response = await MenuService.httpClient.delete(`/${id}`, this.getJwtConfig(jwt));
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

    static async getById(id: string, jwt: string | null): Promise<IResultObject<IMenu>> {
        try {
            const response = await MenuService.httpClient.get<IMenu>(`/${id}`, this.getJwtConfig(jwt));
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

    static async update(id: string, menuData: IMenu, jwt: string | null): Promise<IResultObject<IMenu>> {
        try {
            const response = await MenuService.httpClient.put<IMenu>(`/${id}`, menuData, this.getJwtConfig(jwt));
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
