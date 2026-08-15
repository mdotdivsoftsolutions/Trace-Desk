import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponseEnvelope } from './api-response';

const baseURL = typeof window !== 'undefined' ? '/api' : (process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/api` : '/api');

export const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 30000,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Response Interceptor with Automatic Token Refresh
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponseEnvelope<any>>) => {
    return response;
  },
  async (error: AxiosError<ApiResponseEnvelope<any>>) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // If unauthorized and not already retrying, and not the auth endpoints themselves
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshRes = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        if (refreshRes.data.success) {
          processQueue(null);
          return axiosInstance(originalRequest);
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
          window.location.href = `/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`;
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    const customError = {
      message: error.response?.data?.message || (error.response?.data as any)?.error || error.message || 'An unexpected error occurred',
      status: error.response?.status || 500,
      errors: error.response?.data?.errors || null,
      data: error.response?.data || null,
    };
    return Promise.reject(customError);
  }
);

/**
 * Standard typed API client wrapper for TanStack Query & components.
 */
export const apiClient = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.get<ApiResponseEnvelope<T>>(url, config);
    return response.data.data as T;
  },

  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.post<ApiResponseEnvelope<T>>(url, data, config);
    return response.data.data as T;
  },

  put: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.put<ApiResponseEnvelope<T>>(url, data, config);
    return response.data.data as T;
  },

  patch: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.patch<ApiResponseEnvelope<T>>(url, data, config);
    return response.data.data as T;
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.delete<ApiResponseEnvelope<T>>(url, config);
    return response.data.data as T;
  },
};

export default apiClient;
