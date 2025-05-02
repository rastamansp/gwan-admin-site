import axios from 'axios';
import env from '../config/env';
import { getAuthToken } from '../utils/auth';

export interface CreateKnowledgeDto {
    name: string;
    description: string;
    userId?: string;
}

export interface KnowledgeBase {
    _id: string;
    name: string;
    description: string;
    userId: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateKnowledgeBaseDto {
    name: string;
    description: string;
}

class KnowledgeService {
    private static instance: KnowledgeService;
    private baseUrl: string;

    private constructor() {
        this.baseUrl = env.API_URL;
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

    async createKnowledgeBase(name: string, description: string): Promise<KnowledgeBase> {
        const response = await axios.post(
            `${this.baseUrl}/user/knowledge`,
            { name, description },
            { headers: this.getHeaders() }
        );
        return response.data;
    }

    async updateKnowledgeBase(id: string, data: { name?: string; description?: string }): Promise<KnowledgeBase> {
        const response = await axios.patch(
            `${this.baseUrl}/user/knowledge/${id}`,
            data,
            { headers: this.getHeaders() }
        );
        return response.data;
    }

    async deleteKnowledgeBase(id: string): Promise<void> {
        await axios.delete(`${this.baseUrl}/user/knowledge/${id}`, {
            headers: this.getHeaders()
        });
    }

    async startProcess(id: string): Promise<KnowledgeBase> {
        const response = await axios.post(
            `${this.baseUrl}/user/knowledge/${id}/process`,
            {},
            { headers: this.getHeaders() }
        );
        return response.data;
    }
}

export default KnowledgeService; 