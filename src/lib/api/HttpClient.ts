import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, isAxiosError } from "axios";
import { IApiErrorResponse, IApiSuccessResponse } from "@/types/api";
import { TokenStore } from "@/lib/auth/TokenStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api";

export class ApiClientError extends Error {
  constructor(public readonly statusCode: number, message: string, public readonly fieldErrors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiClientError";
  }
}

/**
 * HttpClient wraps a single shared axios instance. Every domain-specific
 * API class (AuthApi, BorrowerApi, SalesApi, ...) EXTENDS this class to
 * inherit get/post/patch/delete + uniform error handling instead of
 * re-implementing fetch logic per feature.
 *
 * Auth is sent as `Authorization: Bearer <token>` (read from TokenStore)
 * on every request - this works regardless of cross-site cookie policy.
 * `withCredentials: true` is kept so the httpOnly cookie also still works
 * for same-origin/proxied deployments, but the header is the primary path.
 */
export abstract class HttpClient {
  protected readonly axios: AxiosInstance;

  protected constructor(baseURL: string = API_BASE_URL) {
    this.axios = axios.create({ baseURL, withCredentials: true });

    this.axios.interceptors.request.use((config) => {
      const token = TokenStore.get();
      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.unwrap(this.axios.get<IApiSuccessResponse<T>>(url, config));
  }

  protected async post<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.unwrap(this.axios.post<IApiSuccessResponse<T>>(url, body, config));
  }

  protected async patch<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.unwrap(this.axios.patch<IApiSuccessResponse<T>>(url, body, config));
  }

  protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.unwrap(this.axios.delete<IApiSuccessResponse<T>>(url, config));
  }

  private async unwrap<T>(promise: Promise<AxiosResponse<IApiSuccessResponse<T>>>): Promise<T> {
    try {
      const response = await promise;
      return response.data.data;
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  private normalizeError(error: unknown): ApiClientError {
    if (isAxiosError<IApiErrorResponse>(error)) {
      const statusCode = error.response?.status ?? 0;
      const message = error.response?.data?.message ?? error.message ?? "Something went wrong";
      const fieldErrors = error.response?.data?.errors;
      return new ApiClientError(statusCode, message, fieldErrors);
    }
    return new ApiClientError(0, "Network error - could not reach the server");
  }
}
