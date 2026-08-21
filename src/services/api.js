// src/services/api.js

import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = process.env.REACT_APP_API_BASE;

const API = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        Accept: "application/json",
        "ngrok-skip-browser-warning": "true",
    },
});

let isRefreshing = false;
let failedQueue = [];

/**
 * Process pending requests while token refresh
 */
const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

/**
 * Request Interceptor
 * Attach Access Token
 */
API.interceptors.request.use(
    (config) => {
        const token =
            sessionStorage.getItem("accessToken") ||
            sessionStorage.getItem("restoreToken");

        // Attach Authorization Token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Default Content-Type
        if (!config.headers["Content-Type"]) {
            config.headers["Content-Type"] = "application/json";
        }

        // Ngrok Bypass
        config.headers["ngrok-skip-browser-warning"] = "true";

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response Interceptor
 */
API.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        /**
         * ==========================
         * Handle 404 Not Found
         * ==========================
         */
        if (error.response?.status === 404) {
            const message =
                error?.response?.data?.message ||
                error?.response?.data?.detail ||
                "The requested resource was not found";

            // Show specific 404 toast
            toast.error(`404: ${message}`);

            // You can also handle 404 globally here
            // For example, redirect to a 404 page
            // window.location.href = "/404";

            // Reject with custom error
            const notFoundError = new Error(message);
            notFoundError.status = 404;
            notFoundError.response = error.response;
            
            return Promise.reject(notFoundError);
        }

        /**
         * ==========================
         * Handle Token Refresh (401)
         * ==========================
         */
        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            // Already refreshing token
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(API(originalRequest));
                        },
                        reject,
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken =
                    sessionStorage.getItem("refreshToken");

                // Refresh API Call
                const response = await axios.post(
                    `${BASE_URL}/auth/refresh`,
                    {
                        refreshToken,
                    }
                );

                const newAccessToken =
                    response.data.accessToken;

                // Save New Token
                sessionStorage.setItem(
                    "accessToken",
                    newAccessToken
                );

                // Update Default Header
                API.defaults.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                // Retry Pending Requests
                processQueue(null, newAccessToken);

                // Retry Original Request
                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                return API(originalRequest);

            } catch (refreshError) {

                const message =
                    refreshError?.response?.data?.message ||
                    "Session expired. Please login again.";

                toast.error(message);

                processQueue(refreshError, null);

                // Clear Session
                sessionStorage.clear();

                // Redirect Login
                if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
                    window.location.href = "/login";
                }

                return Promise.reject(refreshError);

            } finally {
                isRefreshing = false;
            }
        }

        /**
         * ==========================
         * Handle All Other Errors
         * ==========================
         */

        const message =
            error?.response?.data?.message ||
            error?.response?.data?.detail ||
            Object.values(error?.response?.data || {})
                ?.flat()
                ?.join(", ") ||
            error?.message ||
            "Something went wrong";

        // Show Toast
        toast.error(message);

        // Reject Error
        return Promise.reject(error);
    }
);

export default API;