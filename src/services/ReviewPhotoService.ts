import { IReviewPhoto } from "@/domain/IReviewPhoto";
import axios, { AxiosRequestConfig } from "axios";
import { IResultObject } from "./IResultObject";
import ReviewService from "./ReviewService";

export default class ReviewPhotoService{
    private constructor() {

    }

    private static httpClient = axios.create({
        baseURL: '/api/v1/ReviewPhotos',
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

    static async getAll(): Promise<IResultObject<IReviewPhoto[]>> {
        try {
            const response = await ReviewPhotoService.httpClient.get("");
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

    static async create(menuItemCategoryData: IReviewPhoto): Promise<IResultObject<IReviewPhoto>> {
        try {
            const response = await ReviewPhotoService.httpClient
                .post<IReviewPhoto>("", menuItemCategoryData);
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

    static async getAllPhotosForReview(reviewId: string): Promise<IResultObject<IReviewPhoto[]>> {
        try {
            const response = await ReviewPhotoService.httpClient.get(`/all/${reviewId}`);
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