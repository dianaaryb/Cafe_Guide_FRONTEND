import axios, { AxiosRequestConfig } from "axios";
import { IResultObject } from "./IResultObject";
import { IMenuItem } from "@/domain/IMenuItem";
import { IMenu } from "@/domain/IMenu";

export default class MenuItemService{
    private constructor() {

    }

    private static httpClient = axios.create({
        baseURL: '/api/v1/MenuItems',
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

    static async getMenus(): Promise<IMenu[]> {
        const response = await axios.get('/api/v1/Menus/all');
        return response.data.$values;
    }

    static async getAll(jwt: string | null): Promise<IResultObject<IMenuItem[]>> {
        try {
            const response = await MenuItemService.httpClient.get("", this.getJwtConfig(jwt));
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

    static async getAllMenuItemsForMenu(menuId: string): Promise<IResultObject<IMenuItem[]>> {
        try {
            const response = await MenuItemService.httpClient.get(`/all/${menuId}`);
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

    static async create(menuItemData: IMenuItem): Promise<IResultObject<IMenuItem>> {
        try {
            const response = await MenuItemService.httpClient
                .post<IMenuItem>("", menuItemData);
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
            const response = await MenuItemService.httpClient.delete(`/${id}`, this.getJwtConfig(jwt));
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

    static async getById(id: string): Promise<IResultObject<IMenuItem>> {
        try {
            const response = await MenuItemService.httpClient.get<IMenuItem>(`/${id}`);
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

    static async update(id: string, menuItemData: IMenuItem, jwt: string | null): Promise<IResultObject<IMenuItem>> {
        try {
            const response = await MenuItemService.httpClient.put<IMenuItem>(`/${id}`, menuItemData, this.getJwtConfig(jwt));
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