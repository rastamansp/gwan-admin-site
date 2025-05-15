import { useCallback } from 'react';
import axios from 'axios';
import type { Chatbot, CreateChatbotDto, UpdateChatbotDto, ChatbotStatus } from '../types/chatbot';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export function useChatbotService() {
    const listChatbots = useCallback(async (): Promise<Chatbot[]> => {
        const response = await axios.get(`${API_URL}/chatbots`);
        return response.data;
    }, []);

    const getChatbot = useCallback(async (id: string): Promise<Chatbot> => {
        const response = await axios.get(`${API_URL}/chatbots/${id}`);
        return response.data;
    }, []);

    const createChatbot = useCallback(async (data: CreateChatbotDto): Promise<Chatbot> => {
        const response = await axios.post(`${API_URL}/chatbots`, data);
        return response.data;
    }, []);

    const updateChatbot = useCallback(async (id: string, data: UpdateChatbotDto): Promise<Chatbot> => {
        const response = await axios.put(`${API_URL}/chatbots/${id}`, data);
        return response.data;
    }, []);

    const deleteChatbot = useCallback(async (id: string): Promise<void> => {
        await axios.delete(`${API_URL}/chatbots/${id}`);
    }, []);

    const changeChatbotStatus = useCallback(async (id: string, status: ChatbotStatus): Promise<Chatbot> => {
        const response = await axios.patch(`${API_URL}/chatbots/${id}/status`, { status });
        return response.data;
    }, []);

    return {
        listChatbots,
        getChatbot,
        createChatbot,
        updateChatbot,
        deleteChatbot,
        changeChatbotStatus,
    };
} 