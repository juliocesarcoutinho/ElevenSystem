import axios from 'axios';
import config from '../../config/config';
import UsuarioService from '../usuario/UsuarioService';
import {Demo} from '../../../types';

interface Role {
    id: number;
    authority: string;
}

// Criação da instância do Axios com a configuração da baseURL
const api = axios.create({
    baseURL: config.API_BASE_URL
});

// Interceptor para adicionar o token de autorização nas requisições
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(UsuarioService.CHAVE_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Definição do serviço de usuário
export const RoleService = {
    CHAVE_TOKEN: 'authToken',

//Método para criar as roles.
    async createRoles(role: {authority: string }): Promise<{
        success: boolean;
        data?: never;
        message?: string
    }> {
        try {
            const response = await api.post('/roles', role);
            return {success: true, data: response.data};
        } catch (error: any) {
            let errorMessage = 'Erro ao salvar a função.';

            if (error.response?.data) {
                const {status, error: errorType, message} = error.response.data;
                if (message) {
                    errorMessage = message;
                } else if (errorType) {
                    errorMessage = errorType;
                }
            }
            return {success: false, message: errorMessage};
        }
    },

    //Método de buscar a lista de roles
    async getRoles(endpoint: string): Promise<Role[]> {
        try {
            const response = await api.get(endpoint);
            if (endpoint === '/roles') {
                return response.data.map((role: Role) => ({
                    id: role.id,
                    authority: role.authority
                }));
            } else {
                return response.data.content.map((role: Role) => ({
                    ...role,
                }));
            }
        } catch (error) {
            console.error('Erro na API:', error);
            return [];
        }
    },

    //Método de buscar a roles pelo ID
    async getRoleById(id: number): Promise<{ success: boolean; message?: string; role?: Demo.Role }> {
        try {
            const response = await api.get(`/roles/${id}`);
            return {
                success: true,
                role: response.data
            };
        } catch (error: any) {
            let errorMessage = 'Erro ao buscar a função.';
            if (error.response?.status === 400 && error.response?.data) {
                const validationErrors = error.response.data;
                errorMessage = Object.values(validationErrors).join(', ');
            } else {
                errorMessage = error.response?.data?.message || errorMessage;
            }
            return {success: false, message: errorMessage};
        }
    },

    // Método para editar um a role
    async editRole(role: Role): Promise<{ success: boolean; message?: string }> {
        try {
            await api.put(`/roles/${role.id}`, role);
            return {success: true};
        } catch (error: any) {
            console.error('Erro ao editar função:', error);
            let errorMessage = 'Erro ao atualizar a função.';
            if (error.response?.status === 400 && error.response?.data) {
                const validationErrors = error.response.data;
                errorMessage = Object.values(validationErrors).join(', ');
            } else {
                errorMessage = error.response?.data?.message || errorMessage;
            }

            return {success: false, message: errorMessage};
        }
    },

    // Método para deletar a role
    async deleteRole(id: number): Promise<{ success: boolean, message?: string }> {
        try {
            await api.delete(`/roles/${id}`);
            return {success: true};
        } catch (error) {
            console.error('Erro ao deletar a função:', error);
            return {success: false, message: 'Erro ao excluir a função'};
        }
    },

}