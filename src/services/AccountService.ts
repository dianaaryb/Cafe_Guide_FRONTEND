import { IUserInfo } from "@/state/AppContext";
import axios from "axios";
import { IResultObject } from "./IResultObject";

export default class AccountService {
    private constructor() {

    }

    private static httpClient = axios.create({
        baseURL: '/api/v1/identity/Account',
    });

    static async login(email: string, pwd: string): Promise<IResultObject<IUserInfo>> {
        const loginData = {
            email: email,
            password: pwd
        }
        try {
            const response = await AccountService.httpClient.post<IUserInfo>("login", loginData);
            if (response.status < 300) {
                return {
                    data: response.data
                }
            }
            return {
                errors: [response.status.toString() + " " + response.statusText]
            }
        } catch (error: any) {
            return {
                errors: [JSON.stringify(error)]
            };
        }
    }

    static async register(firstName: string, lastName: string, email: string, password: string): Promise<IResultObject<IUserInfo>>{
        const registerData = {
            firstName,
            lastName,
            email,
            password
        }

        try{
            const response = await AccountService.httpClient.post<IUserInfo>("register", registerData);
            if(response.status < 300){
                return{
                    data: response.data
                }
            }
                return {
                    errors: [response.status.toString() + " " + response.statusText]
                }
            
        } catch (error: any) {
                return {
                    errors: [JSON.stringify(error)]
                };
            }
        }

        static async refreshToken(jwt: string, refreshToken: string): Promise<IResultObject<IUserInfo>> {
            if (!jwt) {
                return {
                    errors: ["Invalid jwt"]
                };
            }
            if (!refreshToken) {
                return {
                    errors: ["Invalid refresh token"]
                };
            }
            const requestData = {
                jwt: jwt, refreshToken: refreshToken
            };
            try {
                const response = await this.httpClient
                    .post<IUserInfo>("refreshTokenData", requestData);
                if (response.status < 300) {
                    return {
                        data: response.data
                    };
                } else {
                    return {
                        errors: [response.status.toString() + " " + response.statusText]
                    };
                }
            } catch (error: any) {
                return {
                    errors: [JSON.stringify(error)]
                };
            }
        }
}
