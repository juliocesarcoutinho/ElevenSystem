import axios from 'axios';
import {LoginService} from '@/services/LoginService';

// Obter a URL base da API do ambiente
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para adicionar o token de autenticação a todas as requisições
api.interceptors.request.use(
    (config) => {
        // Obtém o token do localStorage (apenas no cliente)
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem(LoginService.CHAVE_TOKEN);
            if (token) {
                // Garante que headers existe
                if (!config.headers) {
                    config.headers = {};
                }
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const registerToast = () => {
};

// Interceptor para tratar respostas e erros da API
api.interceptors.response.use(
    // Caso de sucesso - apenas passa a resposta adiante
    (response) => response,

    // Caso de erro - trata diferentes códigos de erro
    (error) => {
        // Verifica se estamos no navegador e se o erro tem uma resposta
        if (typeof window !== 'undefined' && error.response) {

            // Trata especificamente o erro 403 (Forbidden)
            if (error.response.status === 403) {
                console.error('Erro 403: Acesso negado');

                // Adiciona uma propriedade ao objeto de erro para facilitar identificação no tratamento local
                error.isForbidden = true;
            }

            // Trata o erro 401 (Unauthorized) - redireciona para login
            if (error.response.status === 401) {
                console.error('Erro 401: Usuário não autenticado');
                LoginService.logout();
            }
        }
        
        return Promise.reject(error);
    }
);
