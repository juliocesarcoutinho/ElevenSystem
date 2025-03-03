type StatusUsuario = "ATIVO" | "INATIVO";

declare namespace Demo {
  export interface Role {
    id: number | null;
    authority: string;
  }

  export interface User {
    id?: number | null;
    name: string;
    email: string;
    password: string;
    active: boolean;
    created: string;
    updated: string;
    roles: {
      id: number;
      authority: string;
    }[];
  }
}
