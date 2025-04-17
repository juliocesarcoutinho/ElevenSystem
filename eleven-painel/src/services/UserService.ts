import { api } from '@/lib/api';
import { LoginService } from './LoginService';

// Interface para erros do Axios (para versões que não exportam AxiosError)
interface AxiosErrorResponse {
  response?: {
    status: number;
    statusText: string;
    data: ApiErrorResponse;
    headers: Record<string, string>;
  };
  request?: unknown;
  message?: string;
}

interface ApiErrorResponse {
  error?: string;
  message?: string;
  errors?: Array<{
    fieldName: string;
    message: string;
  }>;
  status?: number;
  path?: string;
  timestamp?: string;
}

export interface User {
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

export interface PaginatedResponse {
  content: User[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  active: boolean;
  roles: { id: number, authority: string }[];
}

export class UserService {
  static async getUsers(page: number = 1, size: number = 12, sort: string = 'name,asc'): Promise<PaginatedResponse> {
    try {
      if (!LoginService.isAuthenticated()) {
        throw new Error('Usuário não autenticado');
      }
      
      // Ajuste para API: página começa em 0
      const apiPage = page - 1;
      
      const { data } = await api.get<PaginatedResponse>('/users', {
        params: { page: apiPage, size, sort }
      });

      return data;
    } catch (error) {
      // Verifica se é um erro do Axios
      const axiosError = error as AxiosErrorResponse;
      if (axiosError && axiosError.response) {
        console.error('Erro na requisição:', {
          status: axiosError.response.status,
          statusText: axiosError.response.statusText,
          data: axiosError.response.data,
          headers: axiosError.response.headers
        });

        if (axiosError.response.status === 401) {
          console.log('Token inválido ou expirado');
          LoginService.logout();
        }
      }
      throw error;
    }
  }

  static async createUser(userData: UserFormData): Promise<User> {
    try {
      if (!LoginService.isAuthenticated()) {
        throw new Error('Usuário não autenticado');
      }

      const { data } = await api.post<User>('/users', userData);
      return data;
    } catch (error) {
      const axiosError = error as AxiosErrorResponse;
      if (axiosError && axiosError.response) {
        console.error('Erro ao criar usuário:', {
          status: axiosError.response.status,
          data: axiosError.response.data
        });

        if (axiosError.response.status === 401) {
          LoginService.logout();
        }
      }
      throw error;
    }
  }

  static async updateUser(userId: number, userData: Partial<UserFormData>): Promise<User> {
    try {
      if (!LoginService.isAuthenticated()) {
        throw new Error('Usuário não autenticado');
      }

      const { data } = await api.put<User>(`/users/${userId}`, userData);
      return data;
    } catch (error) {
      const axiosError = error as AxiosErrorResponse;
      if (axiosError && axiosError.response) {
        if (axiosError.response.status === 401) {
          LoginService.logout();
        }
      }
      throw error;
    }
  }

  static async deleteUser(userId: number): Promise<void> {
    try {
      if (!LoginService.isAuthenticated()) {
        throw new Error('Usuário não autenticado');
      }

      await api.delete(`/users/${userId}`);
    } catch (error) {
      const axiosError = error as AxiosErrorResponse;
      if (axiosError && axiosError.response) {
        if (axiosError.response.status === 401) {
          LoginService.logout();
        }
      }
      throw error;
    }
  }
} 