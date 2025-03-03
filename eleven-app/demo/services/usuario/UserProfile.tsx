import axios from "axios";
import config from "@/demo/config/config";
import UsuarioService from "@/demo/services/usuario/UsuarioService";

export interface UserProfile {
  id: number;
  cpf: string;
  birthDate: string;
  phone: string;
  motherName: string;
  fatherName: string;
  user: {
    id: number;
    name: string;
    email: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
    roles: { id: number; authority: string }[];
  };
  address: {
    id: number;
    zipCode: string;
    street: string;
    number: string;
    complement: string;
    district: string;
    city: string;
    uf: string;
  }[];
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

  // Método para buscar a lista de perfis de usuários
  async getUserProfiles(
    page = 0,
    size = 10
  ): Promise<{
    content: UserProfile[];
    totalPages: number;
    totalElements: number;
  }> {
    try {
      const response = await api.get(`/profiles?page=${page}&size=${size}`);
      return {
        content: response.data.content,
        totalPages: response.data.totalPages,
        totalElements: response.data.totalElements,
      };
    } catch (error) {
      console.error("Erro na API:", error);
      throw error; // Lança o erro para ser tratado no componente
    }
  },
};
