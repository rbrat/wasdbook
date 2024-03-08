import React, { useContext, useState, useEffect } from "react";
import { path } from "../helpers";
import { UserContext } from "../context/UserContext";
import { LoginButtonContext, RegisterButtonContext } from "../context/LoginButtonsContext";
import { Outlet, Link } from "react-router-dom";

const Header = () => {
    const [message, setMessage] = useState("");
    const [token, setToken] = useContext(UserContext);
    const [, setLoginButtonState] = useContext(LoginButtonContext);
    const [, setRegisterButtonState] = useContext(RegisterButtonContext);
    const [user, setUser] = useState(null);

    const handleLogout = () => {
        setToken(null);
    };

    const handleLoginButton = () => {
        setLoginButtonState(true);
        setRegisterButtonState(false);
    };

    const handleRegisterButton = () => {
        setLoginButtonState(false);
        setRegisterButtonState(true);
    };

    const getWelcomeMessage = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            },
        };
        const response = await fetch(path + "/", requestOptions);
        const data = await response.json();

        if (!response.ok) {
            setMessage('Service unavailable. ' + data.detail);
        } else {
            setMessage(data.message);
        }
    };

    const getCurrentUser = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        };
        const response = await fetch(path + "/whoami", requestOptions);
        const data = await response.json();

        if (response.ok) {
            setUser(data);
        } else {
            setUser(null);
        }
    }

    useEffect(() => {
        getWelcomeMessage();
        getCurrentUser();
    }, []);

    return (
        <nav className="navbar is-spaced is-primary" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <a role="button" href="/" className="navbar-item">{message}</a>
            </div>
            <div className="navbar-start">
                <div className="navbar-item">
                    <Link to="/" className="has-text-white" >Home</Link>
                </div>
                <div className="navbar-item">
                    <Link to="/browse" className="has-text-white" >Browse</Link>
                </div>
                <Outlet/>
            </div>
            <div className="navbar-items">
                {token && user && (
                    <div className="navbar-item has-background-white">
                        <Link to={`/users/${user.user_id}`}>
                            Profile
                        </Link>
                    </div>
                ) }
            </div>
            <div className="navbar-items">
                {!token && ( 
                    <>
                        <div className="navbar-item">
                            <button className="button" onClick={handleLoginButton}>Login</button>
                        </div>
                        <div className="navbar-item">
                            <button className="button" onClick={handleRegisterButton}>Register</button>
                        </div>
                    </>
                )}
                {token && (
                    <div className="navbar-item">
                        <button className="button" onClick={handleLogout}>Logout</button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Header;