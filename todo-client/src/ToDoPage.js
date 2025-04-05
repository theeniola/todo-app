import React, { useState, useEffect } from "react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig, loginRequest } from "./authConfig";
import ToDoPage from "./ToDoPage";

const msalInstance = new PublicClientApplication(msalConfig);

function App() {
    const [account, setAccount] = useState(null);

    useEffect(() => {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) setAccount(accounts[0]);
    }, []);

    const handleLogin = async () => {
    try {
        const response = await msalInstance.loginPopup(loginRequest);
        setAccount(response.account);
    } catch (error) {
        console.error("Login failed:", error);
    }
    };

    return (
    <div style={{ padding: "20px" }}>
        {!account ? (
        <button onClick={handleLogin}>Sign In with Microsoft</button>
        ) : (
        <ToDoPage userEmail={account.username} />
        )}
    </div>
    );
}

export default App;
