import { api } from '@/lib/api';
import { LoginService } from './LoginService';

export interface Role {
  id: number;
  authority: string;
}

export class RoleService {
  static async getRoles(): Promise<Role[]> {
    try {
      if (!LoginService.isAuthenticated()) {
        throw new Error('Usuário não autenticado');
      }
      
      const { data } = await api.get<Role[]>('/roles');
      return data;
    } catch (error) {
      console.error('Erro ao buscar perfis de acesso:', error);
      throw error;
    }
  }
}
