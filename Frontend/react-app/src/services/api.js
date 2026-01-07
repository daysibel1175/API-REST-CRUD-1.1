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
