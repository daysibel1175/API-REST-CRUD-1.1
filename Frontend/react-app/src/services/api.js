import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE || "http://localhost:9000/trilhasbrasil.com";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function fetcher(path) {
  const { data } = await api.get(path);
  return data;
}

export async function createTrilha(payload) {
  const { data } = await api.post("/trilhas", payload);
  return data;
}

export async function updateTrilha(id, payload) {
  const { data } = await api.patch(`/trilhas/${id}`, payload);
  return data;
}

export async function deleteTrilha(id) {
  const { data } = await api.delete(`/trilhas/${id}`);
  return data;
}

export async function createGuia(payload) {
  const { data } = await api.post("/guias", payload);
  return data;
}

export async function updateGuia(id, payload) {
  const { data } = await api.patch(`/guias/${id}`, payload);
  return data;
}

export async function deleteGuia(id) {
  const { data } = await api.delete(`/guias/${id}`);
  return data;
}

export async function createGrupo(payload) {
  const { data } = await api.post("/grupos", payload);
  return data;
}

export async function updateGrupo(id, payload) {
  const { data } = await api.patch(`/grupos/${id}`, payload);
  return data;
}

export async function deleteGrupo(id) {
  const { data } = await api.delete(`/grupos/${id}`);
  return data;
}

export async function createUsuario(payload) {
  const { data } = await api.post("/usuarios", payload);
  return data;
}

export async function deleteUsuario(id) {
  const { data } = await api.delete(`/usuarios/${id}`);
  return data;
}

export async function getUsuarioByEmail(email) {
  const { data } = await api.get("/usuarios");
  return data.find((u) => u.email === email);
}
