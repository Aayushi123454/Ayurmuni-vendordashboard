// src/services/doctorService.js
import API from "./api";

export const doctorService = {

    // 🔹 Create onboarding
    createOnboarding: (data) => {
        const formData = new FormData();
        for (const key in data) {
            if (data[key] instanceof File) {
                formData.append(key, data[key]);
            } else if (key == "health_diseases") {
                data[key]?.filter((disdata) => formData.append("health_diseases", disdata))
            }
            else if (typeof data[key] === "object") {
                formData.append(key, JSON.stringify(data[key]));
            }
            else {
                formData.append(key, data[key]);
            }
        }
        return API.post("/doctors/profile/", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    getPrakritiAndDiseases: async () => {
        try {
            const [prakriti, diseases] = await Promise.all([
                API.get("/doctors/prakriti/analysis-contents/"),
                API.get("/doctors/health-disease/")
            ]);

            return {
                prakriti: prakriti.data,
                diseases: diseases.data
            };
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
    },

    // 🔹 Upload documents
    uploadDocuments: (data) => {
        const formData = new FormData();
        for (const key in data) {
            console.log(data[key]?.file);
            let file = data[key]?.file;
            if (file == null) continue; // Skip if no file provided
            formData.append(key, file);
        }
        return API.post("/doctors/documents/", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    // 🔹 Update documents
    updateDocuments: (selectedDocument, file) => {
        const formData = new FormData();
        formData.append(selectedDocument, file);
        return API.put("/doctors/documents/", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    // 🔹 Submit bank details
    submitBankDetails: (data) => {
        const formData = new FormData();
        for (const key in data) {
            if (data[key] instanceof File) {
                formData.append(key, data[key]);
            } else {
                formData.append(key, data[key]);
            }
        }

        return API.post("/doctors/bankdetails/", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    // 🔹 Get profile
    getProfile: () => {
        return API.get("/doctors/fullprofile/");
    },

    // 🔹 Update profile
    updateProfile: (data) => {
        const formData = new FormData();
        for (const key in data) {
            if (data[key] == null) continue;
            if (data[key] instanceof File) {
                formData.append(key, data[key]);
            } else if (key == "health_diseases") {
                data[key]?.forEach((disdata) => formData.append("health_diseases", disdata))
            }
            else if (typeof data[key] === "object") {
                formData.append(key, JSON.stringify(data[key]));
            }
            else {
                formData.append(key, data[key]);
            }
        }
        return API.put("/doctors/profile/", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    updatebankDetails: (id, data) => {
        const formData = new FormData();
        for (const key in data) {
            if (data[key] == null) continue; // Skip null values
            formData.append(key, data[key]);
        }
        return API.put(`/doctors/bankdetails/${id}/`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    deleteBankDetails: (id) => {
        return API.delete(`/doctors/bankdetails/${id}/`);
    },

    deleteprofile: () => {
        return API.delete("/doctors/profile/", {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    // 🔹 Get Slot
    getMonthlyAvailability: (year, month) => {
        return API.get(`/doctors/availabilities/?month=${month}&year=${year}`);
    },

    // 🔹 Post Slot
    createSlot: (data) => {
        return API.post("/doctors/availabilities/", data);
    },
    // 🔹 Update Slot
    updateTimeSlot: (slotId, slotData) => {
        return API.put("/doctors/availabilities/" + slotId + "/", slotData);
    },


    // 🔹 Get appointments List
    getAppointment: () => {
        return API.get("/doctors/dashboard/appointments/");
    },

    updateAppointmentstatus: (appointment_id, data) => {
        return API.post(`/doctors/appointments/action/?id=${appointment_id}`, data);
    },
    getAppointmentDetails: (id) => {
        return API.get("/doctors/dashboard/appointments/?id=" + id);
    },

    // 🔹 Get Patient List
    getPatient: () => {
        return API.get("/doctors/dashboard/patients/");
    }

};