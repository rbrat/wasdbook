import React, { createContext, useState } from "react";
export const LoginButtonContext = createContext();
export const RegisterButtonContext = createContext();


export const LoginButtonProvider = (props) => {
  const [loginButtonState, setLoginButtonState] = useState(false);

  return (
    <LoginButtonContext.Provider value={[loginButtonState, setLoginButtonState]}>
      {props.children}
    </LoginButtonContext.Provider>
  );
};

export const RegisterButtonProvider = (props) => {
    const [registerButtonState, setRegisterButtonState] = useState(false);
  
    return (
      <RegisterButtonContext.Provider value={[registerButtonState, setRegisterButtonState]}>
        {props.children}
      </RegisterButtonContext.Provider>
    );
};