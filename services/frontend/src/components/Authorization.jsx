import React, {useContext} from "react";
import { LoginButtonContext, RegisterButtonContext } from "../context/LoginButtonsContext";
import Login from "./Login";
import Register from "./Register";

const Authorization = () => {
    const [loginButtonState] = useContext(LoginButtonContext);
    const [registerButtonState] = useContext(RegisterButtonContext);
    return (
        <div className="column">
                { registerButtonState && (<Register />)}
                { loginButtonState && (<Login />)}
        </div>
    );
};
export default Authorization;