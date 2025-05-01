import axios from 'axios';
import AuthService from './auth.service';

export interface CreateKnowledgeDto {
    name: string;
    description: string;
    fileId: string;
    userId?: string;
}

export interface KnowledgeBase extends CreateKnowledgeDto {
    _id: string;
    status: 'processing' | 'completed' | 'failed';
    error?: string;
    metadata?: {
        totalChunks?: number;
        processedChunks?: number;
        totalTokens?: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

export default class KnowledgeService {
    private static instance: KnowledgeService;
    private baseUrl: string;
    private authService: AuthService;

    private constructor() {
        this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        this.authService = AuthService.getInstance();
    }

    public static getInstance(): KnowledgeService {
        if (!KnowledgeService.instance) {
            KnowledgeService.instance = new KnowledgeService();
        }
        return KnowledgeService.instance;
    }

    private getHeaders() {
        const token = this.authService.getToken();
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    async listKnowledgeBases(): Promise<KnowledgeBase[]> {
        const response = await axios.get(`${this.baseUrl}/user/knowledge`, {
            headers: this.getHeaders()
        });
        return response.data;
    }

    async createKnowledge(data: Omit<CreateKnowledgeDto, 'userId'>): Promise<KnowledgeBase> {
        const userId = this.authService.getUserId();
        console.log('UserId obtido do AuthService:', userId);

        if (!userId) {
            throw new Error('Usuário não está autenticado');
        }

        const requestData = {
            ...data,
            userId
        };
        console.log('Dados sendo enviados para a API:', requestData);

        const response = await axios.post(`${this.baseUrl}/user/knowledge`, requestData, {
            headers: this.getHeaders()
        });
        return response.data;
    }

    async deleteKnowledge(id: string): Promise<void> {
        await axios.delete(`${this.baseUrl}/user/knowledge/${id}`, {
            headers: this.getHeaders()
        });
    }
} 