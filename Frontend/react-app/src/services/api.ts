import axios, { AxiosInstance } from "axios";
import type { Usuario, Trilha, Guia, Grupo } from "../types";

const baseURL: string =
  import.meta.env.VITE_API_BASE || "http://localhost:9000/trilhasbrasil.com";

export const api: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function fetcher<T>(path: string): Promise<T> {
  const { data } = await api.get<T>(path);
  return data;
}

export async function createTrilha(payload: Partial<Trilha>): Promise<Trilha> {
  const { data } = await api.post<Trilha>("/trilhas", payload);
  return data;
}

export async function updateTrilha(
  id: string,
  payload: Partial<Trilha>,
): Promise<Trilha> {
  const { data } = await api.patch<Trilha>(`/trilhas/${id}`, payload);
  return data;
}

export async function deleteTrilha(id: string): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>(`/trilhas/${id}`);
  return data;
}

export async function createGuia(payload: Partial<Guia>): Promise<Guia> {
  const { data } = await api.post<Guia>("/guias", payload);
  return data;
}

export async function updateGuia(
  id: string,
  payload: Partial<Guia>,
): Promise<Guia> {
  const { data } = await api.patch<Guia>(`/guias/${id}`, payload);
  return data;
}

export async function deleteGuia(id: string): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>(`/guias/${id}`);
  return data;
}

export async function createGrupo(payload: Partial<Grupo>): Promise<Grupo> {
  const { data } = await api.post<Grupo>("/grupos", payload);
  return data;
}

export async function updateGrupo(
  id: string,
  payload: Partial<Grupo>,
): Promise<Grupo> {
  const { data } = await api.patch<Grupo>(`/grupos/${id}`, payload);
  return data;
}

export async function deleteGrupo(id: string): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>(`/grupos/${id}`);
  return data;
}

export async function createUsuario(
  payload: Partial<Usuario>,
): Promise<Usuario> {
  const { data } = await api.post<Usuario>("/usuarios", payload);
  return data;
}

export async function deleteUsuario(id: string): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>(`/usuarios/${id}`);
  return data;
}

export async function getUsuarioByEmail(
  email: string,
): Promise<Usuario | undefined> {
  const { data } = await api.get<Usuario[]>("/usuarios");
  return data.find((u) => u.email === email);
}
