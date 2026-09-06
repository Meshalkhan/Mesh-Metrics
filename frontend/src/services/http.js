import axios from "axios";
import { clearSession, getSession } from "../lib/session.js";

const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "http://localhost:4000/api/v1" : "/api/v1");

export const http = axios.create({
  baseURL,
  timeout: 15_000,
  headers: { Accept: "application/json" }
});

http.interceptors.request.use((config) => {
  const session = getSession();
  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
    config.headers["x-tenant-id"] = session.tenantId;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const hadAuth = Boolean(error.config?.headers?.Authorization);
      if (hadAuth) {
        clearSession();
        window.location.reload();
      }
    }

    const body = error.response?.data;
    const errorBody = body?.error ?? body;
    const message = errorBody?.message || error.message || "Request failed";

    const normalized = new Error(message);
    normalized.code = errorBody?.code || error.code || "NETWORK_ERROR";
    normalized.status = error.response?.status;
    normalized.details = errorBody?.details;
    return Promise.reject(normalized);
  }
);
