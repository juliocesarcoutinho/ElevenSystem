import axios from 'axios';
import { AuthService } from './AuthService';

interface User {
  id: number;
  name: string;
  email: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  roles: {
    id: number;
    authority: string;
  }[];
}

interface PaginatedResponse {
  content: User[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use((config) => {
  const token = AuthService.getToken();
  console.log('Token sendo usado:', token); // Debug do token
  
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Headers da requisição:', config.headers); // Debug dos headers
  } else {
    console.log('Token não encontrado ou headers undefined');
  }
  return config;
});

export class UserService {
  static async getUsers(page: number = 0, size: number = 12, sort: string = 'name,asc'): Promise<PaginatedResponse> {
    try {
      if (!AuthService.isAuthenticated()) {
        console.log('Usuário não autenticado');
        throw new Error('Usuário não autenticado');
      }

      console.log('Iniciando requisição para buscar usuários');
      console.log('URL:', '/users');
      console.log('Parâmetros:', { page, size, sort });
      
      const { data } = await api.get<PaginatedResponse>('/users', {
        params: { page, size, sort }
      });

      console.log('Resposta recebida:', data);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Erro na requisição:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers
        });

        if (error.response?.status === 401) {
          console.log('Token inválido ou expirado');
          AuthService.logout();
        }
      }
      throw error;
    }
  }
} 