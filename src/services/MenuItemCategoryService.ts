import axios, { AxiosRequestConfig } from "axios";
import { IResultObject } from "./IResultObject";
import MenuItemService from "./MenuItemService";
import { IMenuItemCategory } from "@/domain/IMenuItemCategory";

export default class MenuItemCategoryService{
    private constructor() {

    }

    private static httpClient = axios.create({
        baseURL: '/api/v1/MenuItemCategories',
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

    static async getAll(): Promise<IResultObject<IMenuItemCategory[]>> {
        try {
            const response = await MenuItemCategoryService.httpClient.get("");
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


    static async create(menuItemCategoryData: IMenuItemCategory): Promise<IResultObject<IMenuItemCategory>> {
        try {
            const response = await MenuItemCategoryService.httpClient
                .post<IMenuItemCategory>("", menuItemCategoryData);
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