import axios from "axios";
import config from "@/demo/config/config";
import UsuarioService from "@/demo/services/usuario/UsuarioService";

interface Address {
  id: number;
  zipCode: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  uf: string;
}

interface UserWithProfile {
  id: number;
  name: string;
  email: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  userProfileId: number | null;
  cpf: string | null;
  birthDate: string | null;
  phone: string | null;
  motherName: string | null;
  fatherName: string | null;
  addresses: Address[] | null; // Lista de endereços (pode ser null)
}

const api = axios.create({
  baseURL: config.API_BASE_URL,
});

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

export const UserProfileService = {
  CHAVE_TOKEN: "authToken",

  // Método para buscar todos os usuários com ou sem perfil
  async getUsersWithProfiles(): Promise<UserWithProfile[]> {
    try {
      const response = await api.get("/users-with-profiles");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar usuários com perfis:", error);
      throw error; // Lança o erro para ser tratado no componente
    }
  },

  // Método para buscar um usuário específico com ou sem perfil pelo ID
  async getUserWithProfileById(userId: number): Promise<UserWithProfile> {
    try {
      const response = await api.get(`/api/users-with-profiles/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar usuário com perfil:", error);
      throw error; // Lança o erro para ser tratado no componente
    }
  },

  // Metodo para inserir novo usuario
  async save(user: UserWithProfile): Promise<void> {
    console.log(user);
  },
};
