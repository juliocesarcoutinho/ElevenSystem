import {api} from '@/lib/api';
import {LoginService} from './LoginService';

interface AxiosErrorResponse {
    response?: {
        status: number;
        statusText: string;
        data: any;
        headers: Record<string, string>;
    };
    request?: unknown;
    message?: string;
}

export interface Address {
    id: number;
    zipCode: string;
    street: string;
    number: string;
    complement: string;
    district: string;
    city: string;
    uf: string;
}

export interface UserWithProfile {
    id: number;
    name: string;
    email: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
    userProfileId: number;
    cpf: string;
    birthDate: string;
    phone: string;
    motherName: string;
    fatherName: string;
    addresses: Address[];
}

export interface PaginatedResponse {
    content: UserWithProfile[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

export class UserWithProfileService {
    private static userCache: UserWithProfile[] = [];
    private static lastLoadedTime: number = 0;
    private static isCacheLoading: boolean = false;
    private static CACHE_VALIDITY = 5 * 60 * 1000; // 5 minutos em milissegundos

    // Cache para resultados de pesquisa
    private static searchCache: { [key: string]: UserWithProfile[] } = {};
    // Esta propriedade armazenará o último termo de busca usado
    private static lastSearchTerm: string = '';

    // Método público para buscar todos os usuários - para busca local no front-end
    static async getAllUsersWithProfiles(): Promise<UserWithProfile[]> {
        return await UserWithProfileService.loadAllUsers();
    }

    static async getUsersWithProfiles(
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
            const hasSearchChanged = trimmedSearch !== UserWithProfileService.lastSearchTerm;

            // Atualiza o último termo de busca
            UserWithProfileService.lastSearchTerm = trimmedSearch;

            // Se temos um termo de busca, vamos fazer um filtro local com todos os usuários
            if (trimmedSearch !== '') {
                console.log(`Executando busca local por "${trimmedSearch}"`);

                // Carrega todos os usuários (usa cache se disponível)
                const allUsers = await UserWithProfileService.loadAllUsers();

                // Filtra os usuários conforme o termo de busca
                const filteredUsers = UserWithProfileService.filterUsers(allUsers, trimmedSearch);
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
                    UserWithProfileService.userCache = []; // Limpa o cache para forçar recarregar
                }

                const {data} = await api.get<PaginatedResponse>('/users-with-profiles', {
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

    // Métodos para limpar cache quando necessário
    static clearCache() {
        UserWithProfileService.userCache = [];
        UserWithProfileService.searchCache = {};
        UserWithProfileService.lastLoadedTime = 0;
        UserWithProfileService.lastSearchTerm = '';
    }

    private static filterUsers(users: UserWithProfile[], searchTerm: string): UserWithProfile[] {
        // Se o termo de busca estiver vazio, retorna todos os usuários
        const trimmedTerm = searchTerm.trim();
        if (!trimmedTerm) {
            console.log('Termo de busca vazio, retornando todos os usuários');
            return users;
        }

        // Construir uma chave única para o cache
        const cacheKey = `${trimmedTerm.toLowerCase()}-${users.length}`;

        // Verifica se já temos resultados em cache
        if (UserWithProfileService.searchCache[cacheKey]) {
            console.log(`Usando cache para busca: "${trimmedTerm}"`);
            return UserWithProfileService.searchCache[cacheKey];
        }

        console.log(`Filtrando ${users.length} usuários pelo termo: "${trimmedTerm}"`);

        const term = trimmedTerm.toLowerCase();
        const result = users.filter(user =>
            user.name.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term) ||
            user.phone.toLowerCase().includes(term) ||
            user.motherName.toLowerCase().includes(term) ||
            user.fatherName.toLowerCase().includes(term) ||
            user.cpf.includes(term)
        );

        UserWithProfileService.searchCache[cacheKey] = result;
        console.log(`Encontrados ${result.length} usuários para "${trimmedTerm}"`);

        return result;
    }

    private static async loadAllUsers(): Promise<UserWithProfile[]> {
        if (UserWithProfileService.isCacheLoading) {
            await new Promise(resolve => setTimeout(resolve, 500));
            return UserWithProfileService.loadAllUsers();
        }

        const now = Date.now();
        // Verifica se o cache ainda é válido
        if (
            UserWithProfileService.userCache.length > 0 &&
            (now - UserWithProfileService.lastLoadedTime < UserWithProfileService.CACHE_VALIDITY)
        ) {
            console.log('Usando cache de usuários:', UserWithProfileService.userCache.length);
            return UserWithProfileService.userCache;
        }

        try {
            UserWithProfileService.isCacheLoading = true;
            console.log('Carregando todos os usuários para o cache...');

            // Busca a primeira página para saber o total
            const firstPage = await UserWithProfileService.fetchPage(1, 100);

            // Se tivermos poucas páginas, buscar apenas a primeira já é suficiente
            if (firstPage.totalElements <= 100) {
                UserWithProfileService.userCache = firstPage.content;
                UserWithProfileService.lastLoadedTime = now;
                console.log('Cache carregado com', UserWithProfileService.userCache.length, 'usuários');
                return UserWithProfileService.userCache;
            }

            // Caso tenha mais páginas, buscar o restante
            const totalPages = Math.ceil(firstPage.totalElements / 100);
            const pagePromises: Promise<PaginatedResponse>[] = [];

            for (let i = 2; i <= totalPages; i++) {
                pagePromises.push(UserWithProfileService.fetchPage(i, 100));
            }

            const additionalPages = await Promise.all(pagePromises);

            // Consolida todos os usuários em uma única lista
            let allUsers = [...firstPage.content];
            additionalPages.forEach(page => {
                allUsers = [...allUsers, ...page.content];
            });

            // Atualiza o cache
            UserWithProfileService.userCache = allUsers;
            UserWithProfileService.lastLoadedTime = now;
            console.log('Cache carregado com', UserWithProfileService.userCache.length, 'usuários');

            return UserWithProfileService.userCache;
        } catch (error) {
            console.error('Erro ao carregar todos os usuários para o cache:', error);
            throw error;
        } finally {
            UserWithProfileService.isCacheLoading = false;
        }
    }

    private static async fetchPage(page: number, size: number): Promise<PaginatedResponse> {
        if (!LoginService.isAuthenticated()) {
            throw new Error('Usuário não autenticado');
        }

        // Ajuste para API: página começa em 0
        const apiPage = page - 1;

        const {data} = await api.get<PaginatedResponse>('/users-with-profiles', {
            params: {
                page: apiPage,
                size,
                sort: 'name,asc'
            }
        });

        return data;
    }
}