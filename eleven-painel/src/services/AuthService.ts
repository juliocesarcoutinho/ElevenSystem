import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
});

interface TokenResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
}

export class AuthService {
  private static CHAVE_TOKEN = 'authToken';
  private static CLIENT_ID = 'client_id';
  private static CLIENT_SECRET = 'cliente_secret';

  static async login(username: string, password: string): Promise<{ success: boolean; message?: string }> {
    try {
      const basicAuth = Buffer.from(`${this.CLIENT_ID}:${this.CLIENT_SECRET}`).toString('base64');
      
      const response = await api.post<TokenResponse>(
        '/oauth2/token',
        new URLSearchParams({
          grant_type: 'password',
          username,
          password,
        }),
        {
          headers: {
            'Authorization': `Basic ${basicAuth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      if (response.data.access_token) {
        localStorage.setItem(this.CHAVE_TOKEN, response.data.access_token);
        return { success: true };
      } else {
        return { success: false, message: 'Token não encontrado na resposta' };
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          return {
            success: false,
            message: error.response?.data?.error_description || 'Credenciais inválidas',
          };
        }
        return {
          success: false,
          message: error.response?.data?.error_description || 'Erro inesperado',
        };
      }
      return { success: false, message: 'Erro inesperado' };
    }
  }

  static logout(): void {
    localStorage.removeItem(this.CHAVE_TOKEN);
    window.location.href = '/login';
  }

  static isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(this.CHAVE_TOKEN);
      return !!token;
    }
    return false;
  }

  static getToken(): string | null {
    return localStorage.getItem(this.CHAVE_TOKEN);
  }
} 