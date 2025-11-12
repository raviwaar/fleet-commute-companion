import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import { client } from "./graphql/client";
import { AuthProvider } from "./contexts/AuthContext";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <AuthProvider>
                <App />
            </AuthProvider>
        </ApolloProvider>
    </React.StrictMode>
);
