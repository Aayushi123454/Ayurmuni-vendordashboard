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
    }
};