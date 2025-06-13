import { HttpService } from './http.service';
import {
    Crawling,
    CrawlingRequest,
    CrawlingListResponse,
    CreateCrawlingResponse
} from '../types/crawling';

export class CrawlingService {
    private static instance: CrawlingService;
    private httpService: HttpService;

    private constructor() {
        this.httpService = HttpService.getInstance();
    }

    public static getInstance(): CrawlingService {
        if (!CrawlingService.instance) {
            CrawlingService.instance = new CrawlingService();
        }
        return CrawlingService.instance;
    }

    async getCrawlings(page: number = 1, limit: number = 10): Promise<CrawlingListResponse> {
        const response = await this.httpService.get<any>(
            `/user/crawling?page=${page}&limit=${limit}`
        );

        // Verifica se a resposta é um array direto ou tem a estrutura esperada
        if (Array.isArray(response.data)) {
            // Se for um array direto, cria a estrutura esperada
            return {
                data: response.data,
                total: response.data.length,
                page: page,
                limit: limit
            };
        }

        // Se já tem a estrutura esperada, retorna como está
        return response.data;
    }

    async getCrawling(id: string): Promise<Crawling> {
        const response = await this.httpService.get<Crawling>(
            `/user/crawling/${id}`
        );
        return response.data;
    }

    async createCrawling(request: CrawlingRequest): Promise<CreateCrawlingResponse> {
        const response = await this.httpService.post<CreateCrawlingResponse>(
            '/user/crawling',
            request
        );
        return response.data;
    }

    async deleteCrawling(id: string): Promise<void> {
        await this.httpService.delete(`/user/crawling/${id}`);
    }
}

export default CrawlingService.getInstance(); 