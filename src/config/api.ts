import axios from "axios";
import { API_BASE_URL, resolveApiKey } from "./apiConfig";
import { getTokenFromLocalStorage } from "./armazenaToken";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getTokenFromLocalStorage();
  const requestUrl = `${config.baseURL ?? ""}${config.url ?? ""}`;

  config.headers = config.headers ?? {};
  config.headers.ApiSecurity = resolveApiKey(requestUrl);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
