// Tipos para as entidades da API

export interface Usuario {
  _id: string;
  nome: string;
  idade: number;
  contato: number;
  email: string;
  isAdmin?: boolean;
  grupos?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Trilha {
  _id: string;
  osm_id?: number;
  nome: string;
  tipo_de_trilha: string;
  tipo_de_rota?: string;
  distancia?: string;
  descricao?: string;
  localizacao?: string;
  dica?: string;
  duracao?: string;
  fonte?: string;
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
  horaPartida?: string;
  horaChegada?: string;
  usuario?: string[] | Usuario[];
  admin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginData {
  email: string;
}

export interface AuthContextType {
  user: Usuario | null;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}
