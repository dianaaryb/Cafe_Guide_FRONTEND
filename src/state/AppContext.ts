import AccountService from "@/services/AccountService";
import {jwtDecode} from "jwt-decode";
import {createContext, useContext, useEffect, useState} from "react";

export interface IUserInfo {
    "jwt": string,
    "refreshToken": string,
    "firstName": string,
    "lastName": string,
    "userId": string
}

export interface IUserContext {
    userInfo: IUserInfo | null,
    setUserInfo: (userInfo: IUserInfo | null) => void
    
}

export const AppContext = createContext<IUserContext | null>(null);

export function GetUserInfo() {
    const userContext = useContext(AppContext);
    const {userInfo, setUserInfo} = userContext || {};
    const [isTokenRefreshing, setIsTokenRefreshing] = useState(false);
    useEffect(() => {
        const storedUserInfo = localStorage.getItem("userInfo");
        if (storedUserInfo) {
            const parsedUserInfo: IUserInfo = JSON.parse(storedUserInfo);
            if (isTokenExpired(parsedUserInfo.jwt)) {
                if (!isTokenRefreshing) {
                    setIsTokenRefreshing(true);
                    AccountService.refreshToken(parsedUserInfo.jwt, parsedUserInfo.refreshToken)
                        .then((newUserInfo) => {
                            setIsTokenRefreshing(false);
                            setUserInfo && setUserInfo(newUserInfo.data!);
                            localStorage.setItem("userInfo", JSON.stringify(newUserInfo.data));
                        })
                        .catch((error) => {
                            setIsTokenRefreshing(false);
                            console.error("Failed to refresh token", error);
                        });
                }
            } else {
                setUserInfo && setUserInfo(parsedUserInfo);
            }
        }
    }, [setUserInfo, isTokenRefreshing]);

    useEffect(() => {
        if (userInfo) {
            // const userInfoString = JSON.stringify(userInfo);
            localStorage.setItem("userInfo", JSON.stringify(userInfo));
        }
    }, [userInfo]);

    return userInfo;
}

function isTokenExpired(token: string): boolean {
    if (!token) {
        return true;
    }
    const decodedToken: any = jwtDecode(token);
    const expirationDate = new Date(0);
    expirationDate.setUTCSeconds(decodedToken.exp!);
    return expirationDate < new Date();
}












// import { createContext, useContext, useEffect } from "react";

// export interface IUserInfo {
//     userId?: string,
//     jwt: string,
//     refreshToken: string,
//     firstName: string,
//     lastName: string
// }

// export interface IUserContext {
//     userInfo: IUserInfo | null,
//     setUserInfo: (userInfo: IUserInfo | null) => void
// }


// export const AppContext = createContext<IUserContext | null>(null);

// export function GetUserInfo() {
//     const userContext = useContext(AppContext);

//     useEffect(() => {
//         const userInfo = sessionStorage.getItem('userInfo');
//         if (userInfo) {
//             const parsedUserInfo = JSON.parse(userInfo);
//             userContext?.setUserInfo(parsedUserInfo);
//         }
//     }, []);

//     useEffect(() => {
//         if (userContext?.userInfo) {
//             const userInfo = JSON.stringify(userContext.userInfo);
//             sessionStorage.setItem('userInfo', userInfo);
//         }
//     }, [userContext]);
//     return userContext?.userInfo;
// }
