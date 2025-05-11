import axios from 'axios';
import env from '../config/env';
import { getAuthToken } from '../utils/auth';

export interface CreateKnowledgeDto {
    name: string;
    description: string;
    userId?: string;
}

export interface KnowledgeFile {
    id: string;
    name: string;
    size: number;
    type: string;
    uploadedAt: string;
    processedFileId?: string;
}

export interface KnowledgeBase {
    _id: string;
    name: string;
    description: string;
    status: string;
    rawFiles: KnowledgeFile[];
    processedFiles: KnowledgeFile[];
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

    async updateKnowledgeBase(id: string, data: { name?: string; description?: string; bucketFileId?: string }): Promise<KnowledgeBase> {
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

    async startProcess(id: string, bucketFileId: string): Promise<KnowledgeBase> {
        const response = await axios.post(
            `${this.baseUrl}/user/knowledge/${id}/start-process`,
            { bucketFileId },
            { headers: this.getHeaders() }
        );
        return response.data;
    }

    async addRawFile(baseId: string, file: File): Promise<KnowledgeFile> {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post(`${this.baseUrl}/user/knowledge/${baseId}/files`, formData, {
            headers: {
                ...this.getHeaders(),
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }

    async processFile(baseId: string, fileId: string, processedFile: any): Promise<KnowledgeFile> {
        const response = await axios.post(`${this.baseUrl}/user/knowledge/${baseId}/process-file/${fileId}`, processedFile, {
            headers: this.getHeaders(),
        });
        return response.data;
    }
}

export default KnowledgeService; 