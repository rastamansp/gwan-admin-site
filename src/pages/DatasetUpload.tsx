import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DatasetService, DatasetFile } from '../services/dataset.service';
import KnowledgeService, { KnowledgeBase } from '../services/knowledge.service';
import { formatFileSize, formatDate } from '../utils/format';
import { ArrowDownTrayIcon, DocumentPlusIcon } from '@heroicons/react/24/outline';
import FileUploadModal from '../components/FileUploadModal';

const DatasetUpload: React.FC = () => {
    const { knowledgeBaseId } = useParams<{ knowledgeBaseId: string }>();
    const navigate = useNavigate();
    const [files, setFiles] = useState<DatasetFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase | null>(null);
    const [loadingKnowledge, setLoadingKnowledge] = useState(true);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const datasetService = DatasetService.getInstance();
    const knowledgeService = KnowledgeService.getInstance();

    useEffect(() => {
        loadFiles();
        if (knowledgeBaseId) {
            loadKnowledgeBase();
        }
    }, [knowledgeBaseId]);

    const loadKnowledgeBase = async () => {
        if (!knowledgeBaseId) return;
        
        try {
            setLoadingKnowledge(true);
            const knowledge = await knowledgeService.getKnowledgeById(knowledgeBaseId);
            setKnowledgeBase(knowledge);
        } catch (err) {
            console.error('Erro ao carregar base de conhecimento:', err);
            setError('Base de conhecimento não encontrada');
            // Redireciona para a lista de bases de conhecimento após um erro
            setTimeout(() => {
                navigate('/knowledge');
            }, 3000);
        } finally {
            setLoadingKnowledge(false);
        }
    };

    const loadFiles = async () => {
        try {
            setLoading(true);
            const fileList = await datasetService.listFiles();
            setFiles(fileList);
        } catch (err) {
            setError('Erro ao carregar arquivos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {loadingKnowledge ? (
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                </div>
            ) : knowledgeBase ? (
                <>
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Base de Conhecimento
                            </h1>
                            <button
                                onClick={() => setIsUploadModalOpen(true)}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                <DocumentPlusIcon className="h-5 w-5 mr-2" />
                                Adicionar Arquivo
                            </button>
                        </div>
                        <div className="mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                Base de Conhecimento: {knowledgeBase.name}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                                {knowledgeBase.description}
                            </p>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Status: <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                    ${knowledgeBase.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                    knowledgeBase.status === 'processing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                                    knowledgeBase.status === 'new' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                    {knowledgeBase.status === 'completed' ? 'Concluído' :
                                     knowledgeBase.status === 'processing' ? 'Processando' :
                                     knowledgeBase.status === 'new' ? 'Novo' : 'Falhou'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Files List */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Arquivos Enviados</h2>
                        {loading ? (
                            <p className="text-gray-500 dark:text-gray-400">Carregando...</p>
                        ) : files.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400">Nenhum arquivo enviado</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Nome
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Tamanho
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Data de Upload
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Ações
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {files.map((file) => (
                                            <tr key={file.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[300px]" title={file.originalName}>
                                                        {file.originalName}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {formatFileSize(file.size)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {formatDate(file.lastModified)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <a
                                                        href={file.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 inline-flex items-center"
                                                        title="Download arquivo"
                                                    >
                                                        <ArrowDownTrayIcon className="h-5 w-5" />
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <FileUploadModal
                        isOpen={isUploadModalOpen}
                        onClose={() => setIsUploadModalOpen(false)}
                        knowledgeBaseId={knowledgeBaseId || ''}
                        onUploadSuccess={loadFiles}
                    />
                </>
            ) : (
                <div className="text-center text-red-600 dark:text-red-400">
                    {error}
                </div>
            )}
        </div>
    );
};

export default DatasetUpload;