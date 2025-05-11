export interface HttpRequestConfig {
    headers?: Record<string, string>;
    params?: Record<string, any>;
}

export interface HttpResponse<T = any> {
    data: T;
    status: number;
    headers: Record<string, string>;
}

export interface IHttpService {
    get<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>>;
    post<T>(url: string, data?: any, config?: HttpRequestConfig): Promise<HttpResponse<T>>;
    put<T>(url: string, data?: any, config?: HttpRequestConfig): Promise<HttpResponse<T>>;
    delete<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>>;
} 