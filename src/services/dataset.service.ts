import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface DatasetFile {
    id: string;
    originalname: string;
    filename: string;
    size: number;
    mimetype: string;
    url: string;
    createdAt: string;
    lastModified?: string;
}

export class DatasetService {
    private static instance: DatasetService;
    private token: string | null = null;

    private constructor() {
        this.token = localStorage.getItem('token');
    }

    public static getInstance(): DatasetService {
        if (!DatasetService.instance) {
            DatasetService.instance = new DatasetService();
        }
        return DatasetService.instance;
    }

    private getHeaders() {
        return {
            Authorization: `Bearer ${this.token}`,
        };
    }

    async listFiles(): Promise<DatasetFile[]> {
        try {
            const response = await axios.get(`${API_URL}/user/dataset/list`, {
                headers: this.getHeaders(),
            });

            // Mapear a resposta da API para o formato esperado
            return response.data.map((file: any) => ({
                id: file.id,
                originalname: file.originalName || file.name,
                filename: file.fileName || file.name,
                size: file.size,
                mimetype: file.mimeType || file.mimetype,
                url: file.url,
                createdAt: file.createdAt || file.lastModified,
                lastModified: file.lastModified
            }));
        } catch (error) {
            console.error('Error listing files:', error);
            throw error;
        }
    }

    async uploadFile(file: File): Promise<DatasetFile> {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post(`${API_URL}/user/dataset/upload`, formData, {
                headers: {
                    ...this.getHeaders(),
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Mapear a resposta da API para o formato esperado
            return {
                id: response.data.id,
                originalname: response.data.originalname,
                filename: response.data.filename,
                size: response.data.size,
                mimetype: response.data.mimetype,
                url: response.data.url,
                createdAt: response.data.createdAt || new Date().toISOString(),
                lastModified: response.data.lastModified
            };
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    }
} 