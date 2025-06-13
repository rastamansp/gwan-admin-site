import React, { useState, useEffect, useCallback } from 'react';
import KnowledgeService, { KnowledgeBase } from '../services/knowledge.service';
import "../../../i18n/config";

const KnowledgeBaseList: React.FC = () => {
    const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const knowledgeService = KnowledgeService.getInstance();

    const loadKnowledgeBases = useCallback(async () => {
        try {
            setLoading(true);
            const bases = await knowledgeService.listKnowledgeBases();
            setKnowledgeBases(bases);
        } catch {
            setError('Erro ao carregar bases de conhecimento');
        } finally {
            setLoading(false);
        }
    }, [knowledgeService]);

    useEffect(() => {
        loadKnowledgeBases();
    }, [loadKnowledgeBases]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'processing':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'new':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'failed':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed':
                return 'Concluído';
            case 'processing':
                return 'Processando';
            case 'new':
                return 'Novo';
            case 'failed':
                return 'Falhou';
            default:
                return 'Desconhecido';
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bases de Conhecimento</h1>
            </div>
            {error && (
                <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            {loading ? (
                <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                </div>
            ) : knowledgeBases.length > 0 ? (
                <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nome</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Descrição</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Criado em</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {knowledgeBases.map((base) => (
                                <tr key={base._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{base.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{base.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`${getStatusColor(base.status)} px-2 inline-flex text-xs leading-5 font-semibold rounded-full`}>
                                            {getStatusText(base.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(base.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <a href="#" className="text-primary-600 hover:text-primary-900">
                                            Editar
                                        </a>
                                        <a href="#" className="text-primary-600 hover:text-primary-900 ml-2">
                                            Excluir
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Nenhuma base de conhecimento encontrada.
                    </p>
                </div>
            )}
        </div>
    );
};

export default KnowledgeBaseList;