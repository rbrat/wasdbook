import "bulma/css/bulma.min.css";
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { UserProvider } from './context/UserContext';
import { LoginButtonProvider, RegisterButtonProvider } from "./context/LoginButtonsContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LoginButtonProvider>
      <RegisterButtonProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </RegisterButtonProvider>
    </LoginButtonProvider>
  </React.StrictMode>
);

