import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_URL ?? "http://localhost:3000"}/api`;

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

async function request(method, url, { data, config } = {}) {
  try {
    const response = await api.request({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    throw formatAxiosError(error);
  }
}

function formatAxiosError(error) {
  if (!axios.isAxiosError(error)) {
    return error;
  }

  const status = error.response?.status ?? null;
  const payload = error.response?.data;
  const message =
    payload?.message || error.response?.statusText || error.message || "Terjadi kesalahan";

  const formattedError = new Error(message);
  formattedError.status = status;
  formattedError.data = payload;
  formattedError.original = error;
  return formattedError;
}

export const apiGet = (url, config) => request("get", url, { config });
export const apiPost = (url, data, config) => request("post", url, { data, config });
export const apiPut = (url, data, config) => request("put", url, { data, config });
export const apiDelete = (url, config) => request("delete", url, { config });
