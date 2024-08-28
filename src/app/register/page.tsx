"use client"

import AccountService from "@/services/AccountService";
import { AppContext } from "@/state/AppContext";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

export default function Register(){
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const router = useRouter();
    const [validationError, setvalidationError] = useState("");
    const { userInfo, setUserInfo } = useContext(AppContext)!;

    const validateAndRegister = async () => {
        if (email.length < 5 || password.length < 6 || password !== confirmPassword) {
            setvalidationError("Invalid input lengths or password do not match!");
            return;
        }

        const response = await AccountService.register(firstName, lastName, email, password);
        if (response.data) {
            setUserInfo(response.data);
            router.push ("/");
        }

        if (response.errors && response.errors.length > 0) {
            setvalidationError(response.errors[0]);
        }
    }


    return (
        <div className="container mt-4">
            <h2>Register</h2>
            <hr />
            <div className="text-danger" role="alert">{validationError}</div>
                <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button onClick={(e) => validateAndRegister()} className="btn btn-primary mt-3">Register</button>
        </div>
    );



}