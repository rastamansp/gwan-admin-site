export type ChatbotStatus = 'active' | 'inactive';

export interface ApiChatbot {
    id: string;
    userId: string;
    name: string;
    description: string;
    systemPrompt: string;
    aiModel: string;
    contentWindowSize?: number;
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

export interface Chatbot {
    id: string;
    userId: string;
    name: string;
    description: string;
    systemPrompt: string;
    aiModel: string;
    status: ChatbotStatus;
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

export interface CreateChatbotDto {
    name: string;
    description: string;
    systemPrompt: string;
    aiModel: string;
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
}

export interface UpdateChatbotDto {
    name?: string;
    description?: string;
    systemPrompt?: string;
    aiModel?: string;
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
}

export interface UpdateN8nConfigDto {
    n8nId: string;
    n8nWorkflowId: string;
    n8nChatUrl: string;
    n8nChatRequireButtonClicktoStart: boolean;
    n8nChatTitle: string;
    n8nChatSubtitle: string;
    n8nChatInitialMessage: string;
}

export interface UpdateVectorConfigDto {
    dataVector: string;
    dataVectorSize: number;
    dataVectorIndex: string;
    dataVectorNamespace: string;
    dataVectorModel: string;
    dataVectorEmbeddingsModel: string;
}

export interface UpdateStatusDto {
    isActive: boolean;
}

export const defaultN8nConfig: UpdateN8nConfigDto = {
    n8nId: '',
    n8nWorkflowId: '',
    n8nChatUrl: '',
    n8nChatRequireButtonClicktoStart: false,
    n8nChatTitle: '',
    n8nChatSubtitle: '',
    n8nChatInitialMessage: '',
};

export const defaultVectorConfig: UpdateVectorConfigDto = {
    dataVector: '',
    dataVectorSize: 1536,
    dataVectorIndex: '',
    dataVectorNamespace: '',
    dataVectorModel: '',
    dataVectorEmbeddingsModel: '',
};

export const defaultChatbotValues: CreateChatbotDto = {
    name: '',
    description: '',
    systemPrompt: '',
    aiModel: 'gpt-4-turbo',
    n8nId: '',
    n8nWorkflowId: '',
    n8nChatUrl: '',
    n8nChatRequireButtonClicktoStart: false,
    n8nChatTitle: '',
    n8nChatSubtitle: '',
    n8nChatInitialMessage: '',
    dataVector: '',
    dataVectorSize: 1536,
    dataVectorIndex: '',
    dataVectorNamespace: '',
    dataVectorModel: '',
    dataVectorEmbeddingsModel: '',
};

export const mapApiChatbotToChatbot = (apiChatbot: ApiChatbot): Chatbot => {
    const { id, aiModel, isActive, ...rest } = apiChatbot;
    return {
        id,
        aiModel,
        status: isActive ? 'active' : 'inactive',
        isActive,
        ...rest,
    };
}; 