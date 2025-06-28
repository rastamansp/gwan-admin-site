import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import crawlingService from '../services/crawling.service';
import { CrawlingRequest } from '../types/crawling';

export const useCrawlings = (page: number = 1, limit: number = 10) => {
    return useQuery({
        queryKey: ['crawlings', page, limit],
        queryFn: () => crawlingService.getCrawlings(page, limit),
        staleTime: 5 * 60 * 1000, // 5 minutos
        retry: 1,
    });
};

export const useCrawling = (id: string) => {
    return useQuery({
        queryKey: ['crawling', id],
        queryFn: () => crawlingService.getCrawling(id),
        enabled: !!id,
        staleTime: 2 * 60 * 1000, // 2 minutos
        retry: 1,
    });
};

export const useCreateCrawling = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: CrawlingRequest) => crawlingService.createCrawling(request),
        onSuccess: (data) => {
            // Invalida as queries de listagem para refetch
            queryClient.invalidateQueries({ queryKey: ['crawlings'] });
            toast.success('Crawling criado com sucesso!');
        },
        onError: (error: Error) => {
            console.error('Erro ao criar crawling:', error);
            toast.error('Erro ao criar crawling. Verifique os dados e tente novamente.');
        },
    });
};

export const useDeleteCrawling = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => crawlingService.deleteCrawling(id),
        onSuccess: () => {
            // Invalida as queries de listagem para refetch
            queryClient.invalidateQueries({ queryKey: ['crawlings'] });
            toast.success('Crawling excluído com sucesso!');
        },
        onError: (error: Error) => {
            console.error('Erro ao excluir crawling:', error);
            toast.error('Erro ao excluir crawling. Tente novamente.');
        },
    });
}; 