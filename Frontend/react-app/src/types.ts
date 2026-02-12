// Tipos compartilhados para a aplicação
export interface Usuario {
  _id: string;
  nome: string;
  idade: number;
  contato: number;
  email: string;
  grupo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Trilha {
  _id: string;
  nome: string;
  tipo_de_trilha: string;
  descricao?: string;
  localizacao?: string;
  dica?: string;
  duracao?: string;
  img?: string;
  guia?: string[] | Guia[];
  grupo?: string[] | Grupo[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Guia {
  _id: string;
  nome: string;
  contato: number;
  trilha?: string | Trilha;
  grupo?: string | Grupo;
  createdAt?: string;
  updatedAt?: string;
}

export interface Grupo {
  _id: string;
  guia: string | Guia;
  familiar: boolean;
  usuario?: string[] | Usuario[];
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface AuthUser {
  email: string;
  nome?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}
