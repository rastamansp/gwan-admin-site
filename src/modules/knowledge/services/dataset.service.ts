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

    async uploadFileToKnowledgeBase(file: File, datasetId: string): Promise<DatasetFile> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await this.httpService.post<DatasetFile>(`/user/datasets/${datasetId}/documents`, formData);
        return response.data;
    }

    async listFiles(datasetId: string): Promise<DatasetFile[]> {
        const response = await this.httpService.get<DatasetFile[]>(`/user/datasets/${datasetId}/documents`);
        return response.data;
    }

    async deleteFile(datasetId: string, documentId: string): Promise<void> {
        await this.httpService.delete(`/user/datasets/${datasetId}/documents/${documentId}`);
    }
} 