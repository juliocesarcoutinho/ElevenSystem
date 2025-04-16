import axios from 'axios';
import { LoginService } from '@/services/LoginService';

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
