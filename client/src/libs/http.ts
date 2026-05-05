import axios from "axios";

const http = axios.create({
    // baseURL: process.env.VITE_API_BASE_URL,
    baseURL: "http://localhost:8000",
    // timeout: 10000, 
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Request interceptor
http.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
http.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error("Unauthorized");
            // optional: redirect to login
        }

        return Promise.reject(error);
    }
);

export default http;
