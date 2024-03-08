import React, { useState, useEffect } from "react";
import ErrorMessage from "./ErrorMessage";
import { path, validatePassword } from "../helpers";

const UserUpdate = ({user_id, token}) => {
    const [errorMessage, setErrorMessage] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [confirmationPassword, setConfirmationPassword] = useState("");

    useEffect(() => {
        const getUser = async () => {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            };
            const response = await fetch(path + `/users/${user_id}`, requestOptions);
            const data = await response.json();
            if (!response.ok) {
                setErrorMessage("Could not load the user. " + data.detail);
            } else {
                setUsername(data.username);
                setEmail(data.email);
            }
        };

        if (user_id) {
            getUser();
        }
    }, [user_id, token]);

    const handleSubmit = (e) => {
        e.preventDefault();
        let validationFailed = null;
        if (password) {
            validationFailed = validatePassword(password, confirmationPassword);
        }
        if (!validationFailed) {
            submitUpdate();
        } else {
            setErrorMessage(validationFailed);
        }
    };

    const submitUpdate = async () => {
        const requestOptions = {
            method: "PATCH",
            headers:  {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({'username': username, 'email': email, 'password': password}),
        };

        const response = await fetch(path + `/users/${user_id}`, requestOptions);
        const data = await response.json();

        if (!response.ok) {
            setErrorMessage(data.detail);
        } else {
            setUsername(data.username);
            setEmail(data.email);
        }
    }

    return (
        <div className="column">
        <form className="box" onSubmit={handleSubmit}>
                <h1 className="title has-text-centered">Profile</h1>
                <div className="field">
                    <label className="label">Username</label>
                    <div className="control">
                        <input type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} className="input" required />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Email</label>
                    <div className="control">
                        <input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" required />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Password</label>
                    <div className="control">
                        <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Confirm password</label>
                    <div className="control">
                        <input type="password" placeholder="Enter confirmation password" value={confirmationPassword} onChange={(e) => setConfirmationPassword(e.target.value)} className="input" />
                    </div>
                </div>
                <ErrorMessage message={errorMessage} />
                <br />
                <button className="button is-primary" type="submit">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default UserUpdate;