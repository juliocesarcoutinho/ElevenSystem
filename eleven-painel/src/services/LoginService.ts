import axios from "axios";

interface TokenResponse {
    access_token: string;
    token_type: string;
    refresh_token?: string;
    expires_in?: number;
    scope?: string;
}

interface ApiError {
    error: string;
    error_description?: string;
    message?: string;
}

interface LoginResponse {
    success: boolean;
    data?: TokenResponse;
    message?: string;
}

type ApiErrorResponse = {
    response?: {
        status: number;
        data: ApiError;
    };
};

const errorMessages: { [key: string]: string } = {
    'invalid_credentials': 'Email ou senha inválidos',
    'Invalid credentials': 'Email ou senha inválidos',
    'invalid_grant': 'Email ou senha inválidos',
    'invalid_request': 'Requisição inválida',
    'server_error': 'Erro no servidor',
    'unauthorized_client': 'Cliente não autorizado',
    'Token not found in response': 'Erro ao processar resposta do servidor',
    'Inactive user, please check with the administrator': 'Usuário inativo, favor verificar com o administrador',
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const LoginService = {
    CHAVE_TOKEN: "authToken",

    async login(
        email: string,
        password: string,
        client_id: string,
        client_secret: string
    ): Promise<LoginResponse> {
        try {
            const basicAuth = Buffer.from(`${client_id}:${client_secret}`).toString(
                "base64"
            );
            const response = await api.post<TokenResponse>(
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

            if (response.data.access_token) {
                localStorage.setItem(this.CHAVE_TOKEN, response.data.access_token);
                return {success: true, data: response.data};
            } else {
                return {success: false, message: "Token não encontrado na resposta"};
            }
        } catch (error) {
            const err = error as ApiErrorResponse;

            if (err.response) {
                const errorKey = (err.response.data.error || err.response.data.message || '') as string;

                // Verifica especificamente a mensagem de usuário inativo
                if (err.response.data.error === "Usuário inativo, favor verificar com o administrador") {
                    return {
                        success: false,
                        message: "Usuário inativo, favor verificar com o administrador",
                    };
                }

                if (err.response.status === 400 || err.response.status === 401) {
                    return {
                        success: false,
                        message: errorMessages[errorKey] || 'Email ou senha inválidos',
                    };
                }
                return {
                    success: false,
                    message: errorMessages[errorKey] || 'Ocorreu um erro inesperado',
                };
            }
            return {success: false, message: "Erro de conexão. Verifique sua internet."};
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