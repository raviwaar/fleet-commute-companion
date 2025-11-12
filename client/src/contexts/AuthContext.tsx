import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContextType, User, View } from "../types";
import { client } from "../graphql/client";
import { LOGIN_MUTATION, REGISTER_USER } from "../graphql/mutations/authMutations";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [currentView, setCurrentView] = useState<View>("Home");
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!token);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
            setIsLoggedIn(true);
            setCurrentView("Dashboard");
        }
    }, []);

    // Persist user and token to localStorage whenever they change
    useEffect(() => {
        if (token) localStorage.setItem("token", token);
        else localStorage.removeItem("token");

        if (user) localStorage.setItem("user", JSON.stringify(user));
        else localStorage.removeItem("user");

        setIsLoggedIn(!!token && !!user);
    }, [token, user]);

    const login = async (username: string, password: string) => {
        const { data } = await client.mutate({
            mutation: LOGIN_MUTATION,
            variables: { username, password },
        });
        const authData = data.tokenAuth;

        setToken(authData.token);
        setUser(authData.payload);
        setCurrentView("Dashboard");
    };

    const register = async (username: string, email: string, password: string) => {
        const { data } = await client.mutate({
            mutation: REGISTER_USER,
            variables: { username, email, password },
        });

        setToken(data.registerUser.token);
        setUser(data.registerUser.user);
        setCurrentView("Dashboard");
    };

    const updateUser = (updatedUser: Partial<User>) => {
        if (!user) return;
        const newUser = { ...user, ...updatedUser };
        setUser(newUser);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.clear();
        setCurrentView("Home");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                token,
                currentView,
                setCurrentView,
                isLoggedIn,
                login,
                register,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
