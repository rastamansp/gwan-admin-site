import axios from 'axios';
import { SessionService } from './session.service';
import env from '../config/env';
import logger from './logger.service';

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
    private readonly sessionService: SessionService;

    private constructor() {
        this.baseUrl = env.API_URL;
        this.sessionService = SessionService.getInstance();
    }

    public static getInstance(): DatasetService {
        if (!DatasetService.instance) {
            DatasetService.instance = new DatasetService();
        }
        return DatasetService.instance;
    }

    private getHeaders() {
        const token = this.sessionService.getToken();
        if (!token) {
            throw new Error('No authentication token available');
        }
        return {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        };
    }

    private getJsonHeaders() {
        const token = this.sessionService.getToken();
        if (!token) {
            throw new Error('No authentication token available');
        }
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    async uploadFile(file: File, datasetId: string): Promise<DatasetFile> {
        logger.info('Iniciando upload de arquivo', {
            service: 'dataset',
            operation: 'uploadFile',
            datasetId,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type
        });

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${this.baseUrl}/user/datasets/${datasetId}/documents`, formData, {
                headers: this.getHeaders(),
            });

            logger.info('Upload de arquivo concluído com sucesso', {
                service: 'dataset',
                operation: 'uploadFile',
                datasetId,
                fileId: response.data.id
            });

            return response.data;
        } catch (error) {
            logger.error('Erro ao fazer upload de arquivo', error as Error, {
                service: 'dataset',
                operation: 'uploadFile',
                datasetId,
                fileName: file.name
            });
            throw error;
        }
    }

    async uploadFileToKnowledgeBase(file: File, datasetId: string): Promise<DatasetFile> {
        logger.info('Iniciando upload de arquivo para base de conhecimento', {
            service: 'dataset',
            operation: 'uploadFileToKnowledgeBase',
            datasetId,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type
        });

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${this.baseUrl}/user/datasets/${datasetId}/documents`, formData, {
                headers: this.getHeaders(),
            });

            logger.info('Upload de arquivo para base de conhecimento concluído', {
                service: 'dataset',
                operation: 'uploadFileToKnowledgeBase',
                datasetId,
                fileId: response.data.id
            });

            return response.data;
        } catch (error) {
            logger.error('Erro ao fazer upload de arquivo para base de conhecimento', error as Error, {
                service: 'dataset',
                operation: 'uploadFileToKnowledgeBase',
                datasetId,
                fileName: file.name
            });
            throw error;
        }
    }

    async listFiles(datasetId: string): Promise<DatasetFile[]> {
        logger.info('Listando arquivos do dataset', {
            service: 'dataset',
            operation: 'listFiles',
            datasetId
        });

        try {
            const response = await axios.get(`${this.baseUrl}/user/datasets/${datasetId}/documents`, {
                headers: this.getJsonHeaders(),
            });

            logger.info('Listagem de arquivos concluída', {
                service: 'dataset',
                operation: 'listFiles',
                datasetId,
                fileCount: response.data.length
            });

            return response.data;
        } catch (error) {
            logger.error('Erro ao listar arquivos do dataset', error as Error, {
                service: 'dataset',
                operation: 'listFiles',
                datasetId
            });
            throw error;
        }
    }

    async deleteFile(datasetId: string, documentId: string): Promise<void> {
        logger.info('Iniciando exclusão de arquivo', {
            service: 'dataset',
            operation: 'deleteFile',
            datasetId,
            documentId
        });

        try {
            await axios.delete(`${this.baseUrl}/user/datasets/${datasetId}/documents/${documentId}`, {
                headers: this.getJsonHeaders(),
            });

            logger.info('Arquivo excluído com sucesso', {
                service: 'dataset',
                operation: 'deleteFile',
                datasetId,
                documentId
            });
        } catch (error) {
            logger.error('Erro ao excluir arquivo', error as Error, {
                service: 'dataset',
                operation: 'deleteFile',
                datasetId,
                documentId
            });
            throw error;
        }
    }
} 