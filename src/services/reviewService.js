// services/reviewService.js
import api from './api'; // Your API client

export const reviewService = {
    // Get doctor reviews with filters
    getDoctorReviews: async (params = {}) => {
        try {
            const { status = 'active', page = 1, limit = 10, sort = 'newest', search = '', rating } = params;

            const queryParams = new URLSearchParams({
                status,
                page,
                limit,
                sort,
                ...(search && { search }),
                ...(rating && { rating })
            });

            const response = await api.get(`/review/doctor/?${queryParams.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching reviews:', error);
            throw error;
        }
    },

    // Reply to a review
    replyToReview: async (reviewId, data) => {
        try {
            const response = await api.post(`/review/doctor/?id=${reviewId}`, data);
            return response.data;
        } catch (error) {
            console.error('Error replying to review:', error);
            throw error;
        }
    },

    // Update reply
    updateReply: async (reviewId, data) => {
        try {
            const response = await api.put(`/review/doctor/?id=${reviewId}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating reply:', error);
            throw error;
        }
    },

    // Delete reply
    deleteReply: async (reviewId) => {
        try {
            const response = await api.delete(`/review/doctor/?id=${reviewId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting reply:', error);
            throw error;
        }
    },

    // Archive/Unarchive review (if needed)
    toggleReviewStatus: async (reviewId, status) => {
        try {
            const response = await api.patch(`/review/doctor/${reviewId}/status`, { status });
            return response.data;
        } catch (error) {
            console.error('Error updating review status:', error);
            throw error;
        }
    },

    // Vendor product reviews (authenticated vendor)
    getVendorReviews: async (params = {}) => {
        try {
            const {
                status = 'active',
                page = 1,
                page_size = 10,
                sort = 'newest',
                search = '',
                rating,
                product_id,
                variant_id,
                from_date,
                to_date,
            } = params;

            const queryParams = new URLSearchParams({
                status,
                page,
                page_size,
                sort,
                ...(search && { search }),
                ...(rating && { rating }),
                ...(product_id && { product_id }),
                ...(variant_id && { variant_id }),
                ...(from_date && { from_date }),
                ...(to_date && { to_date }),
            });

            const response = await api.get(`/review/vendor/?${queryParams.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching vendor reviews:', error);
            throw error;
        }
    },

    replyToVendorReview: async (reviewId, data) => {
        try {
            const response = await api.post(`/review/vendor/?id=${reviewId}`, data);
            return response.data;
        } catch (error) {
            console.error('Error replying to vendor review:', error);
            throw error;
        }
    },

    updateVendorReply: async (reviewId, data) => {
        try {
            const response = await api.put(`/review/vendor/?id=${reviewId}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating vendor reply:', error);
            throw error;
        }
    },

    deleteVendorReply: async (reviewId) => {
        try {
            const response = await api.delete(`/review/vendor/?id=${reviewId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting vendor reply:', error);
            throw error;
        }
    },

    reportVendorReview: async (reviewId, data = {}) => {
        try {
            const response = await api.post(`/review/vendor/?id=${reviewId}`, {
                action: 'report',
                ...data,
            });
            return response.data;
        } catch (error) {
            console.error('Error reporting vendor review:', error);
            throw error;
        }
    },
};