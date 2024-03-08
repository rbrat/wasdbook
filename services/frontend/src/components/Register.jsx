import React, { useContext, useState} from "react";

import { UserContext } from "../context/UserContext";
import ErrorMessage from "./ErrorMessage";
import {path, validatePassword} from "../helpers";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [confirmationPassword, setConfirmationPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [, setToken] = useContext(UserContext);


    const submitRegistration = async () => {
        const requestOptions = {
            method: "POST",
            headers:  {"Content-Type": "application/json"},
            body: JSON.stringify({username: username, password: password, email: email}),
        };

        const response = await fetch(path + "/users/", requestOptions);
        const data = await response.json();

        if (!response.ok) {
            setErrorMessage(data.detail);
        } else {
            setToken(data.access_token);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let validationFailed = validatePassword(password, confirmationPassword);
        if (!validationFailed) {
            submitRegistration();
        } else {
            setErrorMessage(validationFailed);
        }
    };

    return (
        <div className="column">
            <form className="box" onSubmit={handleSubmit}>
                <h1 className="title has-text-centered">Register</h1>
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
                        <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" required />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Confirm password</label>
                    <div className="control">
                        <input type="password" placeholder="Enter confirmation password" value={confirmationPassword} onChange={(e) => setConfirmationPassword(e.target.value)} className="input" required />
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

export default Register;