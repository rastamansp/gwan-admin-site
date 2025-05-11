import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { IHttpService, HttpRequestConfig, HttpResponse } from './interfaces/http.service.interface';

export class HttpService implements IHttpService {
    private static instance: HttpService;
    private client: AxiosInstance;
    private baseUrl: string;

    private constructor() {
        this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
        this.client = axios.create({
            baseURL: this.baseUrl,
            timeout: 10000,
        });
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
            headers: response.headers as Record<string, string>,
        };
    }

    async get<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
        const response = await this.client.get<T>(url, this.transformConfig(config));
        return this.transformResponse(response);
    }

    async post<T>(url: string, data?: any, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
        const response = await this.client.post<T>(url, data, this.transformConfig(config));
        return this.transformResponse(response);
    }

    async put<T>(url: string, data?: any, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
        const response = await this.client.put<T>(url, data, this.transformConfig(config));
        return this.transformResponse(response);
    }

    async delete<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
        const response = await this.client.delete<T>(url, this.transformConfig(config));
        return this.transformResponse(response);
    }
} 