import axios from "axios";
import config from "../../config/config";

const api = axios.create({
  baseURL: config.API_BASE_URL,
});

export const LoginService = {
  CHAVE_TOKEN: "authToken",

  async login(
    email: string,
    password: string,
    client_id: string,
    client_secret: string
  ): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const basicAuth = Buffer.from(`${client_id}:${client_secret}`).toString(
        "base64"
      );
      const response = await api.post(
        "/oauth2/token",
        new URLSearchParams({
          grant_type: "password",
          username: email,
          password: password,
        }),
        {
          headers: {
            Authorization: `Basic ${basicAuth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      // Verifica se o token foi retornado
      if (response.data.access_token) {
        localStorage.setItem(this.CHAVE_TOKEN, response.data.access_token);
        return { success: true, data: response.data };
      } else {
        return { success: false, message: "Token not found in response" };
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          return {
            success: false,
            message: error.response?.data.error || "Credenciais inválidas",
          };
        }
        // Trata outros erros
        return {
          success: false,
          message: error.response?.data.message || "Erro inesperado",
        };
      } else {
        return { success: false, message: "Erro inesperado" };
      }
    }
  },

  logout(): void {
    localStorage.removeItem(this.CHAVE_TOKEN);
  },

  isAuthenticated(): boolean {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem(this.CHAVE_TOKEN);
    }
    return false;
  },
};
