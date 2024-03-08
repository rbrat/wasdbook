import React, {useContext} from "react";
import Header from "../components/Header";
import UserUpdate from "../components/UserUpdate";
import UserDelete from "../components/UserDelete";
import { useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const User = () => {
    const {id} = useParams();
    const [token] = useContext(UserContext);
    return (
        <>
            <Header/>
            <UserDelete user_id={id} token={token} />
            <UserUpdate user_id={id} token={token} />
        </>
    );
};

export default User;