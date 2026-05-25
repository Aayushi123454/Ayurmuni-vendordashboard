// src/services/api.js
import axios from "axios";
import toast from "react-hot-toast";
const BASE_URL = "https://06e4-203-110-81-106.ngrok-free.app";

const API = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'ngrok-skip-browser-warning': 'true',
    }
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

// 🔐 Attach token
API.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("accessToken") || sessionStorage.getItem("restoreToken");
        // 🔐 Attach token if exists
        if (token) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${token}`,
            };
        }
        // 📦 Default Content-Type (avoid overriding for file uploads)
        if (!config.headers["Content-Type"]) {
            config.headers["Content-Type"] = "application/json";
        }
        // ⚠️ Ngrok warning bypass
        config.headers["ngrok-skip-browser-warning"] = "true";
        return config;
    },
    (error) => Promise.reject(error)
);

// 🔄 Handle refresh
API.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
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
                const refreshToken = sessionStorage.getItem("refreshToken");
                const res = await axios.post(
                    BASE_URL + "/auth/refresh",
                    { refreshToken }
                );
                const newAccessToken = res.data.accessToken;
                sessionStorage.setItem("accessToken", newAccessToken);

                API.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
                processQueue(null, newAccessToken);
                return API(originalRequest);
            } catch (err) {
                const message = err?.response?.data?.message || "Something went wrong";
                toast.error(message);
                processQueue(err, null);
                sessionStorage.clear();
                // window.location.href = "/login";
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default API;