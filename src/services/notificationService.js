import API from "./api";

export const notificationService = {
    get: (params) => {
        const query = params instanceof URLSearchParams ? params.toString() : new URLSearchParams(params).toString();
        return API.get(`/notifications/?${query}`);
    },

    markRead: (notificationId) => {
        return API.post(`/notifications/?action=read&notification_id=${notificationId}`);
    },

    markAllRead: () => {
        return API.post(`/notifications/?action=read&all=true`);
    },

    clearAll: () => {
        return API.post(`/notifications/?action=clear&all=true`);
    },

    delete: (notificationId) => {
        return API.post(`/notifications/?action=delete&notification_id=${notificationId}`);
    },
};
