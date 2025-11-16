import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export function setupApiInterceptors({ onUnauthorized }) {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const isRefreshEndpoint = originalRequest?.url?.includes("/auth/refresh");
      const shouldAttemptRefresh =
        error.response?.status === 401 &&
        !originalRequest?._retry &&
        typeof onUnauthorized === "function" &&
        !isRefreshEndpoint;

      if (shouldAttemptRefresh) {
        originalRequest._retry = true;
        try {
          await onUnauthorized();
          return api(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    },
  );
}

export const apiGet = (url, config) => api.get(url, config).then((res) => res.data);
export const apiPost = (url, data, config) => api.post(url, data, config).then((res) => res.data);
