import axios from "axios";
import config from "../../config/config";

interface Role {
  id: number;
  authority: string;
}

interface User {
  id?: number;
  name: string;
  email: string;
  active: boolean;
  created: string;
  updated: string;
  roles: Role[];
}

// Criação da instância do Axios com a configuração da baseURL
const api = axios.create({
  baseURL: config.API_BASE_URL,
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
export const UsuarioService = {
  CHAVE_TOKEN: "authToken",

  // Método para buscar a lista de usuários
  async getUsuarios(page = 0, size = 12): Promise<User[]> {
    try {
      const response = await api.get(`/users?page=${page}&size=${size}`);
      const usuarios = response.data.content.map((usuario: User) => ({
        ...usuario,
        ativo:
          typeof usuario.active === "string"
            ? usuario.active === "Sim"
            : usuario.active,
      }));

      return usuarios;
    } catch (error) {
      console.error("Erro na API:", error);
      return [];
    }
  },

  // Método para deletar um usuário
  async deleteUsuario(id: number): Promise<boolean> {
    try {
      await api.delete(`/users/${id}`);
      return true;
    } catch (error: any) {
      console.error("Erro ao deletar usuário:", error);
      if (error.response?.status === 403) {
        throw new Error("Operador não autorizado para excluir usuário");
      }
      throw new Error("Erro ao excluir usuário");
    }
  },

  // Método para editar um usuário
  async editUsuario(
    usuario: User
  ): Promise<{ success: boolean; message?: string }> {
    try {
      await api.put(`/users/${usuario.id}`, usuario);
      return { success: true };
    } catch (error: any) {
      console.error("Erro ao editar usuário:", error);
      let errorMessage = "Erro ao atualizar o usuário.";
      if (error.response?.status === 400 && error.response?.data) {
        const validationErrors = error.response.data;
        errorMessage = Object.values(validationErrors).join(", ");
      } else {
        errorMessage = error.response?.data?.message || errorMessage;
      }

      return { success: false, message: errorMessage };
    }
  },

  async createUsuario(usuario: {
    password: string;
    active: boolean;
    updated: string;
    roles: { nome: string; id: number }[];
    name: string;
    created: string;
    email: string;
  }): Promise<{ success: boolean; message?: string }> {
    try {
      await api.post("/users", usuario);
      return { success: true };
    } catch (error: any) {
      console.error("Erro ao criar usuário:", error);
      let errorMessage = "Erro ao salvar o usuário.";

      if (error.response?.status === 422 && error.response?.data?.errors) {
        // Extraindo mensagens do array `errors`
        errorMessage = error.response.data.errors
          .map((err: { message: string }) => err.message)
          .join("\n");
      } else {
        errorMessage = error.response?.data?.message || errorMessage;
      }

      return { success: false, message: errorMessage };
    }
  },

  //Método de buscar por id
  async getUsuarioById(id: number): Promise<User | null> {
    try {
      const response = await api.get(`/users/${id}`);
      const user = response.data;
      return {
        ...user,
        ativo:
          typeof user.active === "string" ? user.active === "Sim" : user.active,
      };
    } catch (error) {
      console.error("Erro ao buscar usuário por id:", error);
      return null;
    }
  },
};

export default UsuarioService;
