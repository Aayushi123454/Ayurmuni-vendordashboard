// src/services/vendorService.js
import API from "./api";

export const vendorService = {

    createOnboarding: (data) => {
        return API.post("/vendor/onboarding", data);
    },

    getOrders: () => {
        return API.get("/vendor/orders");
    },

    getDashboard: () => {
        return API.get("/vendor/dashboard");
    },

};