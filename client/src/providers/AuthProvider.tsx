import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import http from "../libs/http";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext<any>(null);

const AuthProvider = ({ children }: { children: any }) => {
    const [token, setToken] = useState(
        typeof window !== "undefined" ? localStorage.getItem("token") : null
    );
    const [user, setUser] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) return;

        const fetchMe = async () => {
            try {
                const response = await http.get("/users/me", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                setUser(response.data.user);
            } catch (error) {
                navigate("/login", {
                    replace: true
                });
                toast.error("Something went wrong while fetching user's data.")
            }
        }

        fetchMe();
    }, [token])

    // store token after login
    const storeToken = (newToken: string) => {
        setToken(newToken);
        localStorage.setItem("token", newToken);
    };

    // logout
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
    };

    const isLoggedIn = !!token;

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                setUser,
                storeToken,
                logout,
                isLoggedIn,
                isLoading,
                setLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

// custom hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
};