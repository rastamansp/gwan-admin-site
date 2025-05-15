import type {
    Chatbot,
    CreateChatbotDto,
    UpdateChatbotDto,
    UpdateN8nConfigDto,
    UpdateVectorConfigDto,
    UpdateStatusDto
} from '../types/chatbot';

const API_BASE_URL = '/api/chatbots';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
};

interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

interface ApiChatbot {
    id: string;
    userId: string;
    name: string;
    description: string;
    systemPrompt: string;
    model: string;
    isActive: boolean;
    n8nId?: string;
    n8nWorkflowId?: string;
    n8nChatUrl?: string;
    n8nChatRequireButtonClicktoStart?: boolean;
    n8nChatTitle?: string;
    n8nChatSubtitle?: string;
    n8nChatInitialMessage?: string;
    dataVector?: string;
    dataVectorSize?: number;
    dataVectorIndex?: string;
    dataVectorNamespace?: string;
    dataVectorModel?: string;
    dataVectorEmbeddingsModel?: string;
    createdAt: string;
    updatedAt: string;
}

const mapApiChatbotToChatbot = (apiChatbot: ApiChatbot): Chatbot => {
    const { id, ...rest } = apiChatbot;
    return {
        _id: id,
        ...rest,
    } as Chatbot;
};

export const chatbotService = {
    async list(): Promise<Chatbot[]> {
        const response = await fetch(API_BASE_URL, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch chatbots');
        }
        const result: PaginatedResponse<ApiChatbot> = await response.json();
        return result.data.map(mapApiChatbotToChatbot);
    },

    async create(data: CreateChatbotDto): Promise<Chatbot> {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Failed to create chatbot');
        }
        const apiChatbot: ApiChatbot = await response.json();
        return mapApiChatbotToChatbot(apiChatbot);
    },

    async update(id: string, data: UpdateChatbotDto): Promise<Chatbot> {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Failed to update chatbot');
        }
        const apiChatbot: ApiChatbot = await response.json();
        return mapApiChatbotToChatbot(apiChatbot);
    },

    async updateN8nConfig(id: string, data: UpdateN8nConfigDto): Promise<Chatbot> {
        const response = await fetch(`${API_BASE_URL}/${id}/n8n-config`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Failed to update N8N configuration');
        }
        const apiChatbot: ApiChatbot = await response.json();
        return mapApiChatbotToChatbot(apiChatbot);
    },

    async updateVectorConfig(id: string, data: UpdateVectorConfigDto): Promise<Chatbot> {
        const response = await fetch(`${API_BASE_URL}/${id}/vector-config`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Failed to update vector configuration');
        }
        const apiChatbot: ApiChatbot = await response.json();
        return mapApiChatbotToChatbot(apiChatbot);
    },

    async updateStatus(id: string, data: UpdateStatusDto): Promise<Chatbot> {
        const response = await fetch(`${API_BASE_URL}/${id}/status`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Failed to update chatbot status');
        }
        const apiChatbot: ApiChatbot = await response.json();
        return mapApiChatbotToChatbot(apiChatbot);
    },

    async delete(id: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            throw new Error('Failed to delete chatbot');
        }
    },
}; 