// src/services/authService.js
import API from "./api";

export const authService = {
    // 📝 Send Otp
    SendOtp: (data) => {
        return API.post("/user/send-otp/", data);
    },

    // 🔐 Login
    login: (data) => {
        return API.post("/user/vnd/login/", data);
    },


    // 🏪 Register / Onboarding (Vendor)
    register: (data) => {
        return API.post("/user/vnd/register/", data);
    },

    // 👤 Restore account

    restoreAccount: (data) => {
        return API.patch("/user/profile-revive/", data)
    },




    // 🔄 Refresh Token
    refreshToken: (refreshToken) => {
        return API.post("/auth/refresh", { refreshToken });
    },

    // 🔑 Forgot Password
    forgotPassword: (email) => {
        return API.post("/auth/forgot-password", { email });
    },

    // 🔒 Reset Password
    resetPassword: (data) => {
        return API.post("/auth/reset-password", data);
    },

    // 🚪 Logout
    logout: () => {
        sessionStorage.clear();
    },

};