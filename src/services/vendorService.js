// src/services/vendorService.js
import API from "./api";

export const vendorService = {

    uploadfiles: (file, dir) => {
        const formdata = new FormData();
        formdata.append("image", file);
        formdata.append("dir", dir);
        return API.post("/user/upload/", formdata, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    // Create profile
    createOnboarding: async (data) => {
        try {
            const response = await API.post("/vendors/profile/", data);
            console.log(response.data);
            return response
        } catch (error) {
            console.error("Create Onboarding Error:", error);
        }
    },

    // Get profile
    getProfile: () => {
        return API.get("/vendors/profile/");
    },

    // Update profile
    updateProfile: async (profileData) => {
        try {
            const response = await API.put('/vendors/profile/', profileData);
            return response;
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    },


    // Add bank detail
    addBankDetail: async (bankData) => {
        try {
            const response = await API.post('/vendors/bank-details/', bankData);
            return response;
        } catch (error) {
            console.error('Add bank detail error:', error);
            throw error;
        }
    },

    // Update bank detail
    updateBankDetail: async (bankData) => {
        try {
            const response = await API.put(`/vendors/bank-details/?id=${bankData?.id}`, bankData);
            return response;
        } catch (error) {
            console.error('Update bank detail error:', error);
            throw error;
        }
    },

    // Delete bank detail
    deleteBankDetail: async (data) => {
        try {
            const response = await API.delete(`/vendors/bank-details/?id=${data.bank_detail_id}`);
            return response;
        } catch (error) {
            console.error('Delete bank detail error:', error);
            throw error;
        }
    },

    deleteAccount: async () => {
        try {
            const response = await API.delete(`/vendors/profile/`);
            return response;
        } catch (error) {
            console.error('Delete account error:', error);
            throw error;
        }
    },


    // Add bank detail

    getProducts: async (data) => {
        try {
            const response = await API.get('/vendors/product/');
            return response;
        } catch (error) {
            console.error('Admin service error:', error);
            throw error;
        }
    }

};