import axios from 'axios';
import env from '../config/env';
import { SessionService } from './session.service';

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
    userId: string;
    status: 'new' | 'processing' | 'completed' | 'failed';
}

export interface BucketFile {
    id: string;
    name: string;
    size: number;
    lastModified: string;
    etag: string;
    originalName: string;
    mimeType: string;
    url: string;
    status: string;
}

class KnowledgeService {
    private static instance: KnowledgeService;
    private baseUrl: string;
    private readonly sessionService: SessionService;

    private constructor() {
        this.baseUrl = env.API_URL;
        this.sessionService = SessionService.getInstance();
    }

    public static getInstance(): KnowledgeService {
        if (!KnowledgeService.instance) {
            KnowledgeService.instance = new KnowledgeService();
        }
        return KnowledgeService.instance;
    }

    private getHeaders() {
        const token = this.sessionService.getToken();
        if (!token) {
            throw new Error('No authentication token available');
        }
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    private getUserIdFromToken(): string {
        const token = this.sessionService.getToken();
        if (!token) {
            throw new Error('No authentication token available');
        }
        try {
            // Decode the JWT token (it's in the format: header.payload.signature)
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (!payload.sub) {
                throw new Error('Invalid token: missing user ID');
            }
            return payload.sub;
        } catch (error) {
            console.error('Error decoding token:', error);
            throw new Error('Failed to get user ID from token');
        }
    }

    async listKnowledgeBases(): Promise<KnowledgeBase[]> {
        const response = await axios.get(`${this.baseUrl}/user/knowledge`, {
            headers: this.getHeaders()
        });
        return response.data;
    }

    async createKnowledgeBase(name: string, description: string): Promise<KnowledgeBase> {
        const userId = this.getUserIdFromToken();
        const data: CreateKnowledgeBaseDto = {
            name,
            description,
            userId,
            status: 'new'
        };

        console.log('Creating knowledge base with data:', data);
        const response = await axios.post(
            `${this.baseUrl}/user/knowledge`,
            data,
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
        console.log('Starting process for knowledge base:', { id, bucketFileId });
        const data = {
            id,
            bucketFileId,
            knowledgeBaseId: id
        };

        const response = await axios.post(
            `${this.baseUrl}/user/knowledge/${id}/start-process/${bucketFileId}`,
            data,
            { headers: this.getHeaders() }
        );
        console.log('Process start response:', response.data);
        return response.data;
    }

    async addRawFile(baseId: string, file: File): Promise<KnowledgeFile> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('knowledgeBaseId', baseId);

        console.log('Uploading file to knowledge base:', baseId);
        const response = await axios.post(
            `${this.baseUrl}/user/dataset/${baseId}/documents`,
            formData,
            {
                headers: {
                    ...this.getHeaders(),
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        console.log('File upload response:', response.data);
        return response.data;
    }

    async processFile(baseId: string, fileId: string, processedFile: any): Promise<KnowledgeFile> {
        const response = await axios.post(`${this.baseUrl}/user/knowledge/${baseId}/process-file/${fileId}`, processedFile, {
            headers: this.getHeaders(),
        });
        return response.data;
    }

    async listBucketFiles(): Promise<BucketFile[]> {
        console.log('Fetching bucket files');
        const response = await axios.get(
            `${this.baseUrl}/user/dataset/list`,
            { headers: this.getHeaders() }
        );
        console.log('Bucket files response:', response.data);
        return response.data;
    }

    async deleteBucketFile(bucketFileId: string): Promise<void> {
        console.log('Deleting bucket file:', bucketFileId);
        await axios.delete(
            `${this.baseUrl}/user/dataset/${bucketFileId}`,
            { headers: this.getHeaders() }
        );
        console.log('Bucket file deleted successfully');
    }
}

export default KnowledgeService; 