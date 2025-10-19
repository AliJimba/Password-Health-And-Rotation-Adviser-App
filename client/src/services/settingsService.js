import api from './apiService';

export const saveUserSettings = async (settings) => {
    try {
        const response = await api.post('/settings', settings);
        return response.data.data;
    } catch (error) {
        console.error('Save settings API error:', error);
        throw error;
    }
};

export const getUserSettings = async () => {
    try {
        const response = await api.get('/settings');
        return response.data.data;
    } catch (error) {
        console.error('Get settings API error:', error);
        // Return default settings if error
        return {
            alertThreshold: 50,
            reminderEnabled: false,
            reminderInterval: '1week',
            realtimeScanning: false
        };
    }
};

export const startRealtimeScanning = async () => {
    try {
        const response = await api.post('/settings/scanning/start');
        return response.data;
    } catch (error) {
        console.error('Start scanning API error:', error);
        throw error;
    }
};

export const stopRealtimeScanning = async () => {
    try {
        const response = await api.post('/settings/scanning/stop');
        return response.data;
    } catch (error) {
        console.error('Stop scanning API error:', error);
        throw error;
    }
};
