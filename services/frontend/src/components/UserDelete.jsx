import React from "react";
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import { path } from "../helpers";
import { useNavigate } from "react-router-dom";

const UserDelete = ({user_id, token}) => {
    const navigate = useNavigate();
    const DeleteUser = async () => {
        const requestOptions = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        };
        const response = await fetch(path + `/users/${user_id}`, requestOptions);
        const data = await response.json();
        if (!response.ok) {
            alert("Could not delete the user. " + data.detail);
        } else {
            navigate('/');
        }
    };

    const submit = () => {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure you want to delete your user profile?',
            buttons: [
              {
                label: 'Yes',
                onClick: () => DeleteUser()
              },
              {
                label: 'No',
              }
            ]
          });
    };
    return <button className="button is-fullwidth mb-5 is-danger" onClick={submit}>Delete Profile</button>
};

export default UserDelete;