import React, { useState, useEffect } from 'react';
import KnowledgeService, { KnowledgeBase, KnowledgeFile } from '../services/knowledge.service';
import { Dialog } from '@headlessui/react';
import { PlusIcon, DocumentPlusIcon, PlayIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import '../i18n/config';

interface CreateKnowledgeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CreateKnowledgeModal: React.FC<CreateKnowledgeModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !description) {
            setError('Preencha todos os campos');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const knowledgeService = KnowledgeService.getInstance();
            console.log('Creating knowledge base with data:', {
                name,
                description
            });
            await knowledgeService.createKnowledgeBase(name, description);
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Erro ao criar base de conhecimento:', err);
            setError('Erro ao criar base de conhecimento');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="mx-auto max-w-sm rounded bg-white dark:bg-gray-800 p-6">
                    <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                        Adicionar Base
                    </Dialog.Title>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Nome
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm 
                                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                                focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                placeholder="Digite o nome da base de conhecimento"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Descrição
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm 
                                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                                focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                placeholder="Digite uma descrição para a base de conhecimento"
                                rows={3}
                                required
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        )}

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 
                                border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 
                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent 
                                rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                                focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Criando...' : 'Criar'}
                            </button>
                        </div>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

const KnowledgeBaseList: React.FC = () => {
    const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [processingFile, setProcessingFile] = useState<{ baseId: string; fileId: string } | null>(null);
    const knowledgeService = KnowledgeService.getInstance();

    useEffect(() => {
        loadKnowledgeBases();
    }, []);

    const loadKnowledgeBases = async () => {
        try {
            setLoading(true);
            const bases = await knowledgeService.listKnowledgeBases();
            setKnowledgeBases(bases);
        } catch (err) {
            setError('Erro ao carregar bases de conhecimento');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Tem certeza que deseja excluir esta base de conhecimento?')) {
            return;
        }
        try {
            await knowledgeService.deleteKnowledgeBase(id);
            setKnowledgeBases(prev => prev.filter(base => base._id !== id));
        } catch (err) {
            setError('Erro ao excluir base de conhecimento');
        }
    };

    const handleStartProcess = async (baseId: string, bucketFileId: string) => {
        if (!window.confirm('Deseja iniciar o processamento deste arquivo?')) {
            return;
        }

        try {
            setProcessingFile({ baseId, fileId: bucketFileId });
            console.log('Starting process for file:', { baseId, bucketFileId });
            await knowledgeService.startProcess(baseId, bucketFileId);
            // Recarrega a lista para atualizar o status
            await loadKnowledgeBases();
        } catch (err) {
            console.error('Erro ao iniciar processamento:', err);
            setError('Erro ao iniciar processamento do arquivo');
        } finally {
            setProcessingFile(null);
        }
    };

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
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Adicionar Base
                </button>
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
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(base.status)}`}>{getStatusText(base.status)}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(base.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end items-center gap-4">
                                        <Link
                                            to={`/datasets/${base._id}/documents`}
                                            className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                                            title="Gerenciar Base de Conhecimento"
                                        >
                                            <DocumentPlusIcon className="h-5 w-5" />
                                        </Link>
                                        {base.rawFiles?.map((file) => (
                                            <button
                                                key={file.id}
                                                onClick={() => handleStartProcess(base._id, file.id)}
                                                disabled={processingFile?.fileId === file.id}
                                                className={`text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 
                                                    ${processingFile?.fileId === file.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                title="Iniciar Processamento"
                                            >
                                                <PlayIcon className="h-5 w-5" />
                                            </button>
                                        ))}
                                        <button 
                                            onClick={() => handleDelete(base._id)} 
                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" 
                                            title="Excluir"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">Nenhuma base de conhecimento encontrada</div>
            )}
            <CreateKnowledgeModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    setIsCreateModalOpen(false);
                    loadKnowledgeBases();
                }}
            />
        </div>
    );
};

export default KnowledgeBaseList; 