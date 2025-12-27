import axios from 'axios';

const API_BASE_URL = 'http://localhost:3010';

export const positionService = {
    getPositionInterviewFlow: async (positionId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/position/${positionId}/interviewflow`);
            return response.data;
        } catch (error) {
            console.error('Error fetching position interview flow:', error);
            throw error;
        }
    },

    getPositionCandidates: async (positionId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/position/${positionId}/candidates`);
            return response.data;
        } catch (error) {
            console.error('Error fetching position candidates:', error);
            throw error;
        }
    }
};

