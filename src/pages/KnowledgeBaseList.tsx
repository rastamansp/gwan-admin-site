import React, { useState, useEffect } from 'react';
import KnowledgeService, { KnowledgeBase } from '../services/knowledge.service';
import { formatDate } from '../utils/format';
import { useTranslation } from 'react-i18next';
import { Dialog } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { DatasetService, DatasetFile } from '../services/dataset.service';
import '../i18n/config';

interface CreateKnowledgeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CreateKnowledgeModal: React.FC<CreateKnowledgeModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const { t } = useTranslation();
    const [datasets, setDatasets] = useState<DatasetFile[]>([]);
    const [selectedDataset, setSelectedDataset] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            loadDatasets();
        }
    }, [isOpen]);

    const loadDatasets = async () => {
        try {
            const datasetService = DatasetService.getInstance();
            const fileList = await datasetService.listFiles();
            setDatasets(fileList);
        } catch (err) {
            console.error('Erro ao carregar datasets:', err);
            setError('Erro ao carregar datasets');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDataset || !name || !description) {
            setError('Preencha todos os campos');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const knowledgeService = KnowledgeService.getInstance();
            console.log('Dados do usuário antes de criar:', {
                token: localStorage.getItem('token'),
                user: localStorage.getItem('user')
            });
            await knowledgeService.createKnowledge({
                name,
                description,
                fileId: selectedDataset
            });
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
                                Dataset
                            </label>
                            <select
                                value={selectedDataset}
                                onChange={(e) => setSelectedDataset(e.target.value)}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm 
                                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                                focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                required
                            >
                                <option value="" className="dark:text-gray-100">Selecione um dataset</option>
                                {datasets.map((dataset) => (
                                    <option key={dataset.id} value={dataset.id} className="dark:text-gray-100">
                                        {dataset.name}
                                    </option>
                                ))}
                            </select>
                        </div>

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
                                focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500
                                placeholder-gray-500 dark:placeholder-gray-400"
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
                                focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500
                                placeholder-gray-500 dark:placeholder-gray-400"
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
    const { t } = useTranslation();
    const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const knowledgeService = KnowledgeService.getInstance();

    useEffect(() => {
        // Log do conteúdo do usuário no localStorage
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        console.log('Token armazenado:', storedToken);
        console.log('Usuário armazenado:', storedUser ? JSON.parse(storedUser) : null);

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
            setLoading(true);
            await knowledgeService.deleteKnowledge(id);
            setKnowledgeBases(prev => prev.filter(base => base._id !== id));
        } catch (err) {
            setError('Erro ao excluir base de conhecimento');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed':
                return t('knowledge:status.completed');
            case 'processing':
                return t('knowledge:status.processing');
            case 'failed':
                return t('knowledge:status.failed');
            default:
                return t('knowledge:status.waiting');
        }
    };

    const formatDate = (date: string | Date) => {
        if (!date) return '';
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">{t('knowledge:title')}</h1>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    {t('knowledge:create.title')}
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    {t('knowledge:table.name')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    {t('knowledge:table.description')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    {t('knowledge:table.status')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    {t('knowledge:table.createdAt')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    {t('knowledge:table.actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {knowledgeBases.map((base) => (
                                <tr key={base._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{base.name}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">{base.description}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(base.status)}`}>
                                            {getStatusText(base.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {formatDate(base.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleDelete(base._id)}
                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                        >
                                            {t('knowledge:delete.button')}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {knowledgeBases.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                        {t('knowledge:table.empty')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <CreateKnowledgeModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={loadKnowledgeBases}
            />
        </div>
    );
};

export default KnowledgeBaseList; 