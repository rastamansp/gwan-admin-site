import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { IHttpService, HttpRequestConfig, HttpResponse } from './interfaces/http.service.interface';
import { SessionService } from './session.service';
import env from '../config/env';
import logger from './logger.service';

export class HttpService implements IHttpService {
    private static instance: HttpService;
    private client: AxiosInstance;
    private baseUrl: string;
    private sessionService: SessionService;

    private constructor() {
        this.baseUrl = env.API_URL;
        this.sessionService = SessionService.getInstance();
        this.client = axios.create({
            baseURL: this.baseUrl,
            timeout: 10000,
        });

        // Add request interceptor to include auth token and logging
        this.client.interceptors.request.use((config) => {
            const token = this.sessionService.getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            // Log da requisição
            const method = config.method?.toUpperCase() || 'UNKNOWN';
            const url = config.url || '';
            logger.apiRequest(method, url, {
                headers: config.headers,
                params: config.params
            });

            return config;
        });

        // Add response interceptor for logging
        this.client.interceptors.response.use(
            (response) => {
                const method = response.config.method?.toUpperCase() || 'UNKNOWN';
                const url = response.config.url || '';
                logger.apiResponse(method, url, response.status, {
                    headers: response.headers,
                    data: response.data
                });
                return response;
            },
            (error) => {
                const method = error.config?.method?.toUpperCase() || 'UNKNOWN';
                const url = error.config?.url || '';
                logger.apiError(method, url, error, {
                    status: error.response?.status,
                    data: error.response?.data
                });
                return Promise.reject(error);
            }
        );
    }

    public static getInstance(): HttpService {
        if (!HttpService.instance) {
            HttpService.instance = new HttpService();
        }
        return HttpService.instance;
    }

    private transformConfig(config?: HttpRequestConfig): AxiosRequestConfig {
        return {
            headers: config?.headers,
            params: config?.params,
        };
    }

    private transformResponse<T>(response: AxiosResponse<T>): HttpResponse<T> {
        return {
            data: response.data,
            status: response.status,
            statusText: response.statusText,
            headers: response.headers as Record<string, string>,
        };
    }

    async get<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
        const response = await this.client.get<T>(url, this.transformConfig(config));
        return this.transformResponse(response);
    }

    async post<T>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
        const response = await this.client.post<T>(url, data, this.transformConfig(config));
        return this.transformResponse(response);
    }

    async put<T>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
        const response = await this.client.put<T>(url, data, this.transformConfig(config));
        return this.transformResponse(response);
    }

    async patch<T>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
        const response = await this.client.patch<T>(url, data, this.transformConfig(config));
        return this.transformResponse(response);
    }

    async delete<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
        const response = await this.client.delete<T>(url, this.transformConfig(config));
        return this.transformResponse(response);
    }
} 