// src/services/doctorService.js
import API from "./api";

export const doctorService = {

    dashboardget: () => {
        return API.get("/doctors/dashboard/");
    },
    dashboardfolloupadata: () => {
        return API.get("/doctors/followup-patients/");
    },
    financedashboard: () => {
        return API.get("/doctors/dashboard/financial-metrics/");
    },

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
            let file = data[key];
            if (file == null || file == undefined) continue; // Skip if no file provided
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

    // 🔹 Delete Slot
    deleteTimeSlot: (slotId) => {
        return API.delete(`/doctors/availabilities/${slotId}/`);
    },

    // 🔹 Change password
    changePassword: (data) => {
        return API.post("/auth/change-password/", {
            old_password: data.currentPassword,
            new_password: data.newPassword,
        });
    },

    // 🔹 Get appointments List
    getAppointment: (type) => {
        return API.get(`/doctors/?type=${type}`);
    },

    updateAppointmentstatus: (appointment_id, data) => {
        return API.post(`/doctors/appointments/action/?id=${appointment_id}`, data);
    },
    getAppointmentDetails: (type, id) => {
        return API.get(`/doctors/?type=${type}&id=${id}`);
    },
    getAppointmentprec: (pid, id) => {
        return API.get(`/doctors/prescription/?patient_id=${pid || ''}&appointment_id=${id || ''}`);
    },
    getAppointmentDoc: (type, id) => {
        return API.get(
            `/doctors/appointments/documents/?${type !== "patient"
                ? `appointment_id=${id}`
                : `patient_id=${id}`
            }`
        );
    },
    getUpcomingAppointment: () => {
        return API.get(`/doctors/appointments/upcoming/`);
    },


    // 🔹 Get Patient List (supports pagination & filters)
    getPatient: (type, page = 1, pageSize = 10, search = "", prakriti = "", gender = "") => {
        const params = new URLSearchParams({ type });
        if (page) params.append("page", String(page));
        if (pageSize) params.append("page_size", String(pageSize));
        if (search?.trim()) params.append("search", search.trim());
        if (prakriti && prakriti !== "all") params.append("prakriti", prakriti);
        if (gender && gender !== "all") params.append("gender", gender);
        return API.get(`/doctors/?${params.toString()}`);
    },

    // 🔹 Get single patient details
    getPatientDetails: (patientId) => {
        return API.get(`/doctors/?type=patient&id=${patientId}`);
    },

    // 🔹 Get search product List
    getProductList: (type) => {
        return API.get(`/doctors/medicines/search/?search=` + type);
    },

    // 🔹 Add prescription List
    postprescription: (type, prescriptionData) => {
        return API.post(`/doctors/prescription/?patient_id=` + type, prescriptionData);
    },

    // 🔹 Add prescription List
    questionforpatient: (id) => {
        return API.get(`/doctors/patient-onboarding/?patient_id=` + id);
    },

    // 🔹 Add prescription List
    questionfillforpatient: (data) => {
        return API.post(`/doctors/patient-onboarding/`, data);
    }
};