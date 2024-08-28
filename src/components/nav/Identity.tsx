"use client"

import { AppContext, IUserInfo } from "@/state/AppContext";
import Link from "next/link";
import { useContext } from "react";

export default function Identity() {
    const { userInfo, setUserInfo } = useContext(AppContext)!;


    return userInfo ? <LoggedIn /> : <LoggedOut />;

}


const LoggedIn = () => {
    const { userInfo, setUserInfo } = useContext(AppContext)!;

    const doLogout = () => {
        setUserInfo(null);
    }

    return (
        <ul className="navbar-nav">
            <li className="nav-item">
                <Link href="/" className="nav-link text-dark" title="Manage">Hello cafe lover :)</Link>
            </li>
            <li className="nav-item">
                <Link onClick={(e) => doLogout()} href="/" className="nav-link text-dark" title="Logout">Logout</Link>
            </li>
        </ul>
    );
}

const LoggedOut = () => {
    return (
        <ul className="navbar-nav">
            <li className="nav-item">
                <Link href="/register" className="nav-link text-dark">Register</Link>
            </li>
            <li className="nav-item">
                <Link href="/login" className="nav-link text-dark">Login</Link>
            </li>
        </ul>
    );
}
