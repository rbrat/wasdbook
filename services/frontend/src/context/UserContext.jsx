import React, { createContext, useEffect, useState } from "react";
import {path} from "../helpers";
export const UserContext = createContext();


export const UserProvider = (props) => {
  const [token, setToken] = useState(localStorage.getItem("wasdbookUserToken"));

  useEffect(() => {
    const fetchUser = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };

      const response = await fetch(path + '/whoami', requestOptions);

      if (!response.ok) {
        setToken(null);
      }
      localStorage.setItem("wasdbookUserToken", token);
    };
    fetchUser();
  }, [token]);

  return (
    <UserContext.Provider value={[token, setToken]}>
      {props.children}
    </UserContext.Provider>
  );
};