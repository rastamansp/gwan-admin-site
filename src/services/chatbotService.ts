import { HttpService } from './http.service';
import type {
    Chatbot,
    CreateChatbotDto,
    UpdateChatbotDto,
    UpdateN8nConfigDto,
    UpdateVectorConfigDto,
    UpdateStatusDto,
    ApiChatbot
} from '../types/chatbot';
import { mapApiChatbotToChatbot } from '../types/chatbot';

interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

const httpService = HttpService.getInstance();

export const chatbotService = {
    async list(): Promise<Chatbot[]> {
        const response = await httpService.get<PaginatedResponse<ApiChatbot>>('/chatbots');
        return response.data.data.map(mapApiChatbotToChatbot);
    },

    async get(id: string): Promise<Chatbot> {
        const response = await httpService.get<ApiChatbot>(`/chatbots/${id}`);
        return mapApiChatbotToChatbot(response.data);
    },

    async create(data: CreateChatbotDto): Promise<Chatbot> {
        const response = await httpService.post<ApiChatbot>('/chatbots', data);
        return mapApiChatbotToChatbot(response.data);
    },

    async update(id: string, data: UpdateChatbotDto): Promise<Chatbot> {
        const response = await httpService.put<ApiChatbot>(`/chatbots/${id}`, data);
        return mapApiChatbotToChatbot(response.data);
    },

    async updateN8nConfig(id: string, data: UpdateN8nConfigDto): Promise<Chatbot> {
        const response = await httpService.put<ApiChatbot>(`/chatbots/${id}/n8n-config`, data);
        return mapApiChatbotToChatbot(response.data);
    },

    async updateVectorConfig(id: string, data: UpdateVectorConfigDto): Promise<Chatbot> {
        const response = await httpService.put<ApiChatbot>(`/chatbots/${id}/vector-config`, data);
        return mapApiChatbotToChatbot(response.data);
    },

    async updateStatus(id: string, data: UpdateStatusDto): Promise<Chatbot> {
        const response = await httpService.put<ApiChatbot>(`/chatbots/${id}/status`, data);
        return mapApiChatbotToChatbot(response.data);
    },

    async delete(id: string): Promise<void> {
        await httpService.delete(`/chatbots/${id}`);
    },
};