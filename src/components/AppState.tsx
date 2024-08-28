"use client"

import React, { useState , useEffect} from "react";
import axios from "axios";
import { AppContext, IUserInfo } from "@/state/AppContext";

export default function AppState({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);

    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            try {
                setUserInfo(JSON.parse(storedUserInfo));
            } catch (error) {
                console.error("Error parsing stored user info:", error);
                localStorage.removeItem('userInfo'); // Optionally remove invalid data
            }
        }
    }, []);
    

    // useEffect(() => {
    //     const storedUserInfo = localStorage.getItem('userInfo');
    //     if (storedUserInfo) {
    //         setUserInfo(JSON.parse(storedUserInfo));
    //     }
    // }, []);

    // Function to handle user login
    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post('/api/v1/identity/Account/login', { email, password });
            console.log('Login response:', response); // Log the response
            if (response.status === 200 && response.data) {
                const { jwt, refreshToken, firstName, lastName, userId } = response.data;
                const userInfo: IUserInfo = {
                    jwt: jwt,
                    refreshToken,
                    firstName,
                    lastName,
                    userId // Ensure backend sends this or manage accordingly
                };
                setUserInfo(userInfo); // Update state with new user info
                localStorage.setItem('userInfo', JSON.stringify(userInfo)); // Persist user info in localStorage
            } else {
                throw new Error('Failed to login');
            }
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    // Function to handle user logout
    const logout = () => {
        setUserInfo(null); // Clear user info from state
        localStorage.removeItem('userInfo'); // Clear user info from localStorage
    };

    

    return (
        <AppContext.Provider value={{ userInfo, setUserInfo}}>
            {children}
        </AppContext.Provider>
    );
};








