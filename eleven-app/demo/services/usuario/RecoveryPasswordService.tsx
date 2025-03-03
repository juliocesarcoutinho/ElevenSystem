import axios from 'axios';
import config from '../../config/config';

const api = axios.create({
    baseURL: config.API_BASE_URL
});

export const RecoveryPasswordService = {
    async recoveryPassword(email: string): Promise<{ success: boolean; message?: string }> {
        try {
            const response = await api.post('/recovery-password', { email });
            return { success: true, message: response.data.message };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return { success: false, message: error.response?.data.message || 'Erro inesperado' };
            } else {
                return { success: false, message: 'Erro inesperado' };
            }
        }
    }
};