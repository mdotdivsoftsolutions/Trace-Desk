import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponseEnvelope } from './api-response';

const baseURL = typeof window !== 'undefined' ? '/api' : (process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/api` : '/api');

export const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can attach authorization tokens or telemetry headers here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponseEnvelope<any>>) => {
    return response;
  },
  (error: AxiosError<ApiResponseEnvelope<any>>) => {
    const customError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      status: error.response?.status || 500,
      errors: error.response?.data?.errors || null,
      data: error.response?.data || null,
    };
    return Promise.reject(customError);
  }
);

/**
 * Standard typed API client wrapper.
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
