import { HttpService } from '../../../services/http.service';

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
    private readonly httpService: HttpService;

    private constructor() {
        this.httpService = HttpService.getInstance();
    }

    public static getInstance(): DatasetService {
        if (!DatasetService.instance) {
            DatasetService.instance = new DatasetService();
        }
        return DatasetService.instance;
    }

    async uploadFile(file: File, datasetId: string): Promise<DatasetFile> {
        console.log('Iniciando upload de arquivo', {
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
            const response = await this.httpService.post<DatasetFile>(`/user/datasets/${datasetId}/documents`, formData);

            console.log('Upload de arquivo concluído com sucesso', {
                service: 'dataset',
                operation: 'uploadFile',
                datasetId,
                fileId: response.data.id
            });

            return response.data;
        } catch (error) {
            console.error('Erro ao fazer upload de arquivo', error);
            throw error;
        }
    }

    async uploadFileToKnowledgeBase(file: File, datasetId: string): Promise<DatasetFile> {
        console.log('Iniciando upload de arquivo para base de conhecimento', {
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
            const response = await this.httpService.post<DatasetFile>(`/user/datasets/${datasetId}/documents`, formData);

            console.log('Upload de arquivo para base de conhecimento concluído', {
                service: 'dataset',
                operation: 'uploadFileToKnowledgeBase',
                datasetId,
                fileId: response.data.id
            });

            return response.data;
        } catch (error) {
            console.error('Erro ao fazer upload de arquivo para base de conhecimento', error);
            throw error;
        }
    }

    async listFiles(datasetId: string): Promise<DatasetFile[]> {
        console.log('Listando arquivos do dataset', {
            service: 'dataset',
            operation: 'listFiles',
            datasetId
        });

        try {
            const response = await this.httpService.get<DatasetFile[]>(`/user/datasets/${datasetId}/documents`);

            console.log('Listagem de arquivos concluída', {
                service: 'dataset',
                operation: 'listFiles',
                datasetId,
                fileCount: response.data.length
            });

            return response.data;
        } catch (error) {
            console.error('Erro ao listar arquivos do dataset', error);
            throw error;
        }
    }

    async deleteFile(datasetId: string, documentId: string): Promise<void> {
        console.log('Iniciando exclusão de arquivo', {
            service: 'dataset',
            operation: 'deleteFile',
            datasetId,
            documentId
        });

        try {
            await this.httpService.delete(`/user/datasets/${datasetId}/documents/${documentId}`);

            console.log('Arquivo excluído com sucesso', {
                service: 'dataset',
                operation: 'deleteFile',
                datasetId,
                documentId
            });
        } catch (error) {
            console.error('Erro ao excluir arquivo', error);
            throw error;
        }
    }
} 