import { IUserInfo } from "@/state/AppContext";
import axios from "axios";
import { IResultObject } from "./IResultObject";
import { ICafe } from "@/domain/ICafe";
import { ICity } from "@/domain/ICity";

export default class CityService {
    private constructor() {

    }

    private static httpClient = axios.create({
        baseURL: '/api/v1/Cities',
    });

    static async getAll(jwt: string | null): Promise<IResultObject<ICity[]>> {
        try {
            const response = await CityService.httpClient.get("", {
                headers: {
                    "Authorization": "Bearer " + jwt
                }
            });
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
}
    