import axios from 'axios';
import env from '../../../config/env';
import { SessionService } from '../../../services/session.service';

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

export interface SimilarResult {
    id: string;
    content: string;
    enable: boolean;
    meta: {
        userId: string;
        userName: string;
        userEmail: string;
        fileName: string;
        fileId: string;
        knowledgeBaseId: string;
        knowledgeBaseName: string;
        markdownPath: string;
        processedAt: string;
        bucketName: string;
        originalFileName: string;
        chunkIndex: number;
        totalChunks: number;
    };
}

export class KnowledgeService {
    private static instance: KnowledgeService;
    private baseUrl: string;
    private headers: HeadersInit;
    private readonly sessionService: SessionService;

    private constructor() {
        this.baseUrl = env.API_URL;
        this.sessionService = SessionService.getInstance();
        this.headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        };
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

    async addRawFile(datasetId: string, file: File): Promise<KnowledgeFile> {
        const formData = new FormData();
        formData.append('file', file);

        console.log('Uploading file to dataset:', datasetId);
        const response = await axios.post(
            `${this.baseUrl}/user/datasets/${datasetId}/documents`,
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

    async processFile(baseId: string, fileId: string, processedFile: unknown): Promise<KnowledgeFile> {
        const response = await axios.post(`${this.baseUrl}/user/knowledge/${baseId}/process-file/${fileId}`, processedFile, {
            headers: this.getHeaders(),
        });
        return response.data;
    }

    async listBucketFiles(datasetId: string): Promise<BucketFile[]> {
        console.log('Fetching dataset files');
        const response = await axios.get(
            `${this.baseUrl}/user/datasets/${datasetId}/documents`,
            { headers: this.getHeaders() }
        );
        console.log('Dataset files response:', response.data);
        return response.data;
    }

    async deleteBucketFile(datasetId: string, documentId: string): Promise<void> {
        console.log('Deleting dataset file:', documentId);
        await axios.delete(
            `${this.baseUrl}/user/datasets/${datasetId}/documents/${documentId}`,
            { headers: this.getHeaders() }
        );
        console.log('Dataset file deleted successfully');
    }

    async findSimilar(knowledgeBaseId: string, text: string, limit: number = 5): Promise<SimilarResult[]> {
        console.log('Finding similar content:', { knowledgeBaseId, text, limit });
        const response = await axios.post(
            `${this.baseUrl}/user/knowledge/${knowledgeBaseId}/similar`,
            { text, limit },
            { headers: this.getHeaders() }
        );
        console.log('Similar content response:', response.data);
        return response.data;
    }

    async updateChunkStatus(knowledgeBaseId: string, chunkId: string, enable: boolean): Promise<void> {
        console.log('Atualizando status do chunk:', { knowledgeBaseId, chunkId, enable });
        await axios.patch(
            `${this.baseUrl}/user/knowledge/${knowledgeBaseId}/chunks/${chunkId}/status`,
            { enable },
            { headers: this.getHeaders() }
        );
    }

    async deleteChunk(knowledgeBaseId: string, chunkId: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/user/knowledge/${knowledgeBaseId}/chunks/${chunkId}`, {
            method: 'DELETE',
            headers: this.headers,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Erro ao excluir chunk');
        }
    }
}

export default KnowledgeService; 