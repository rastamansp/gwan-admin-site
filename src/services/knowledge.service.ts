import axios from 'axios';
import AuthService from './auth.service';
import { getAuthToken } from '../utils/auth';

export interface CreateKnowledgeDto {
    name: string;
    description: string;
    userId?: string;
}

export interface KnowledgeBase {
    _id: string;
    userId: string;
    name: string;
    description: string;
    status: 'new' | 'processing' | 'completed' | 'failed';
    error?: string;
    metadata?: {
        totalChunks?: number;
        processedChunks?: number;
        totalTokens?: number;
    };
    createdAt: string;
    updatedAt: string;
}

export interface CreateKnowledgeBaseDto {
    name: string;
    description: string;
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
        const token = getAuthToken();
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

    async createKnowledge(data: CreateKnowledgeBaseDto): Promise<KnowledgeBase> {
        const response = await axios.post(`${this.baseUrl}/user/knowledge`, data, {
            headers: this.getHeaders(),
        });
        return response.data;
    }

    async deleteKnowledge(id: string): Promise<void> {
        await axios.delete(`${this.baseUrl}/user/knowledge/${id}`, {
            headers: this.getHeaders()
        });
    }

    async getKnowledgeById(id: string): Promise<KnowledgeBase> {
        const response = await axios.get(`${this.baseUrl}/user/knowledge/${id}`, {
            headers: this.getHeaders()
        });
        return response.data;
    }

    async startProcess(id: string): Promise<void> {
        await axios.post(`${this.baseUrl}/user/knowledge/${id}/start-process`, {}, {
            headers: this.getHeaders(),
        });
    }
} 