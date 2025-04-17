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
  private static userCache: User[] = [];
  private static lastLoadedTime: number = 0;
  private static isCacheLoading: boolean = false;
  private static CACHE_VALIDITY = 5 * 60 * 1000; // 5 minutos em milissegundos
  
  // Cache para resultados de pesquisa
  private static searchCache: {[key: string]: User[]} = {};
  
  private static filterUsers(users: User[], searchTerm: string): User[] {
    // Se o termo de busca estiver vazio, retorna todos os usuários
    const trimmedTerm = searchTerm.trim();
    if (!trimmedTerm) {
      console.log('Termo de busca vazio, retornando todos os usuários');
      return users;
    }
    
    // Construir uma chave única para o cache
    const cacheKey = `${trimmedTerm.toLowerCase()}-${users.length}`;
    
    // Verifica se já temos resultados em cache
    if (UserService.searchCache[cacheKey]) {
      console.log(`Usando cache para busca: "${trimmedTerm}"`);
      return UserService.searchCache[cacheKey];
    }
    
    console.log(`Filtrando ${users.length} usuários pelo termo: "${trimmedTerm}"`);
    
    // Cria um índice por primeira letra para busca mais rápida 
    // (útil para grandes conjuntos de dados)
    const firstChar = trimmedTerm.charAt(0).toLowerCase();
    
    // Pré-filtra usuários pela primeira letra (otimização para conjuntos grandes)
    const potentialMatches = firstChar ? 
      users.filter(user => 
        user.name.toLowerCase().includes(firstChar) || 
        user.email.toLowerCase().includes(firstChar)
      ) : users;
    
    // Agora faz a busca completa nos usuários pré-filtrados
    const term = trimmedTerm.toLowerCase();
    const result = potentialMatches.filter(user =>
      user.name.toLowerCase().includes(term) || 
      user.email.toLowerCase().includes(term)
    );
    
    // Armazena o resultado no cache
    UserService.searchCache[cacheKey] = result;
    console.log(`Encontrados ${result.length} usuários para "${trimmedTerm}"`);
    
    return result;
  }
  
  // Método público para buscar todos os usuários - para busca local no front-end
  static async getAllUsers(): Promise<User[]> {
    return await UserService.loadAllUsers();
  }
  
  private static async loadAllUsers(): Promise<User[]> {
    if (UserService.isCacheLoading) {
      // Espera enquanto o cache está sendo carregado
      await new Promise(resolve => setTimeout(resolve, 500));
      return UserService.loadAllUsers();
    }
    
    const now = Date.now();
    // Verifica se o cache ainda é válido
    if (
      UserService.userCache.length > 0 && 
      (now - UserService.lastLoadedTime < UserService.CACHE_VALIDITY)
    ) {
      console.log('Usando cache de usuários:', UserService.userCache.length);
      return UserService.userCache;
    }
    
    try {
      UserService.isCacheLoading = true;
      console.log('Carregando todos os usuários para o cache...');
      
      // Busca a primeira página para saber o total
      const firstPage = await UserService.fetchPage(1, 100);
      
      // Se tivermos poucas páginas, buscar apenas a primeira já é suficiente
      if (firstPage.totalElements <= 100) {
        UserService.userCache = firstPage.content;
        UserService.lastLoadedTime = now;
        console.log('Cache carregado com', UserService.userCache.length, 'usuários');
        return UserService.userCache;
      }
      
      // Caso tenha mais páginas, buscar o restante
      const totalPages = Math.ceil(firstPage.totalElements / 100);
      const pagePromises: Promise<PaginatedResponse>[] = [];
      
      for (let i = 2; i <= totalPages; i++) {
        pagePromises.push(UserService.fetchPage(i, 100));
      }
      
      const additionalPages = await Promise.all(pagePromises);
      
      // Consolida todos os usuários em uma única lista
      let allUsers = [...firstPage.content];
      additionalPages.forEach(page => {
        allUsers = [...allUsers, ...page.content];
      });
      
      // Atualiza o cache
      UserService.userCache = allUsers;
      UserService.lastLoadedTime = now;
      console.log('Cache carregado com', UserService.userCache.length, 'usuários');
      
      return UserService.userCache;
    } catch (error) {
      console.error('Erro ao carregar todos os usuários para o cache:', error);
      throw error;
    } finally {
      UserService.isCacheLoading = false;
    }
  }
  
  private static async fetchPage(page: number, size: number): Promise<PaginatedResponse> {
    if (!LoginService.isAuthenticated()) {
      throw new Error('Usuário não autenticado');
    }
    
    // Ajuste para API: página começa em 0
    const apiPage = page - 1;
    
    const { data } = await api.get<PaginatedResponse>('/users', {
      params: { 
        page: apiPage, 
        size, 
        sort: 'name,asc' 
      }
    });
    
    return data;
  }
  
  // Esta propriedade armazenará o último termo de busca usado
  private static lastSearchTerm: string = '';
  
  static async getUsers(
    page: number = 1, 
    size: number = 12, 
    sort: string = 'name,asc', 
    searchTerm: string = ''
  ): Promise<PaginatedResponse> {
    try {
      if (!LoginService.isAuthenticated()) {
        throw new Error('Usuário não autenticado');
      }
      
      const trimmedSearch = searchTerm.trim();
      const hasSearchChanged = trimmedSearch !== UserService.lastSearchTerm;
      
      // Atualiza o último termo de busca
      UserService.lastSearchTerm = trimmedSearch;
      
      // Se temos um termo de busca, vamos fazer um filtro local com todos os usuários
      if (trimmedSearch !== '') {
        console.log(`Executando busca local por "${trimmedSearch}"`);
        
        // Carrega todos os usuários (usa cache se disponível)
        const allUsers = await UserService.loadAllUsers();
        
        // Filtra os usuários conforme o termo de busca
        const filteredUsers = UserService.filterUsers(allUsers, trimmedSearch);
        console.log(`Encontrados ${filteredUsers.length} usuários que correspondem à busca.`);
        
        // Calcula a paginação manualmente
        const start = (page - 1) * size;
        const end = start + size;
        const paginatedUsers = filteredUsers.slice(start, end);
        
        // Constrói a resposta paginada
        return {
          content: paginatedUsers,
          totalElements: filteredUsers.length,
          totalPages: Math.ceil(filteredUsers.length / size),
          size: size,
          number: page - 1,
          first: page === 1,
          last: end >= filteredUsers.length,
          empty: paginatedUsers.length === 0
        };
      } else {
        // Se não temos termo de busca, faz uma requisição normal paginada
        console.log(`Termo de busca vazio - Buscando página ${page} com todos os resultados`);
        
        // Ajuste para API: página começa em 0
        const apiPage = page - 1;
        
        // Se o termo de busca mudou (de alguma coisa para vazio), forçar uma nova requisição
        if (hasSearchChanged) {
          console.log('Termo de busca mudou para vazio - forçando recarga dos dados');
          UserService.userCache = []; // Limpa o cache para forçar recarregar
        }
        
        const { data } = await api.get<PaginatedResponse>('/users', {
          params: { 
            page: apiPage, 
            size, 
            sort 
          }
        });
        
        return data;
      }
    } catch (error) {
      // Verifica se é um erro do Axios
      const axiosError = error as AxiosErrorResponse;
      if (axiosError && axiosError.response) {
        console.error('Erro na requisição:', {
          status: axiosError.response.status,
          statusText: axiosError.response.statusText,
          data: axiosError.response.data
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
      
      // Limpa os caches após criar um usuário
      UserService.userCache = [];
      UserService.searchCache = {};
      UserService.lastLoadedTime = 0;
      
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
      
      // Limpa os caches após atualizar um usuário
      UserService.userCache = [];
      UserService.searchCache = {};
      UserService.lastLoadedTime = 0;
      
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
      
      // Limpa os caches após excluir um usuário
      UserService.userCache = [];
      UserService.searchCache = {};
      UserService.lastLoadedTime = 0;
      
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