import axios from 'axios';
import { getAuthToken } from '../utils/auth';

export interface DatasetFile {
    id: string;
    name: string;
    size: number;
    lastModified: string;
    etag: string;
    originalName: string;
    mimeType: string;
    url: string;
    fileName: string;
    knowledgeBaseId?: string;
}

export class DatasetService {
    private static instance: DatasetService;
    private baseUrl: string;

    private constructor() {
        this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    }

    public static getInstance(): DatasetService {
        if (!DatasetService.instance) {
            DatasetService.instance = new DatasetService();
        }
        return DatasetService.instance;
    }

    private getHeaders() {
        const token = getAuthToken();
        return {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        };
    }

    private getJsonHeaders() {
        const token = getAuthToken();
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    async uploadFile(file: File): Promise<DatasetFile> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(`${this.baseUrl}/user/dataset/upload`, formData, {
            headers: this.getHeaders(),
        });

        return response.data;
    }

    async uploadFileToKnowledgeBase(file: File, knowledgeBaseId: string): Promise<DatasetFile> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(`${this.baseUrl}/user/dataset/${knowledgeBaseId}/documents`, formData, {
            headers: this.getHeaders(),
        });

        return response.data;
    }

    async listFiles(): Promise<DatasetFile[]> {
        const response = await axios.get(`${this.baseUrl}/user/dataset/list`, {
            headers: this.getJsonHeaders(),
        });
        return response.data;
    }

    async deleteFile(id: string): Promise<void> {
        await axios.delete(`${this.baseUrl}/user/dataset/${id}`, {
            headers: this.getJsonHeaders(),
        });
    }
} 