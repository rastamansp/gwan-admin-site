import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import KnowledgeService, { KnowledgeBase, KnowledgeFile, BucketFile } from '../services/knowledge.service';
import { formatFileSize } from '../utils/format';
import { TrashIcon, PlayIcon, ArrowDownTrayIcon, DocumentIcon } from '@heroicons/react/24/outline';

const KnowledgeBaseDatasetUpload: React.FC = () => {
    const { knowledgeBaseId } = useParams<{ knowledgeBaseId: string }>();
    const navigate = useNavigate();
    const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase | null>(null);
    const [bucketFiles, setBucketFiles] = useState<BucketFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const knowledgeService = KnowledgeService.getInstance();

    useEffect(() => {
        if (knowledgeBaseId) {
            loadKnowledgeBase();
            loadBucketFiles();
        }
    }, [knowledgeBaseId]);

    const loadBucketFiles = async () => {
        try {
            const files = await knowledgeService.listBucketFiles();
            setBucketFiles(files);
        } catch (err) {
            console.error('Erro ao carregar arquivos do bucket:', err);
            setError('Erro ao carregar arquivos do bucket');
        }
    };

    const loadKnowledgeBase = async () => {
        setLoading(true);
        try {
            const bases = await knowledgeService.listKnowledgeBases();
            const base = bases.find(b => b._id === knowledgeBaseId) || null;
            setKnowledgeBase(base);
        } catch (err) {
            setError('Erro ao carregar base de conhecimento');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !knowledgeBaseId) return;
        setUploading(true);
        try {
            await knowledgeService.addRawFile(knowledgeBaseId, selectedFile);
            setSelectedFile(null);
            await loadKnowledgeBase();
        } catch (err) {
            setError('Erro ao enviar arquivo');
        } finally {
            setUploading(false);
        }
    };

    const handleDownload = (file: BucketFile) => {
        window.open(file.url, '_blank');
    };

    const handleProcessBucketFile = async (file: BucketFile) => {
        if (!knowledgeBaseId) return;
        try {
            setLoading(true);
            await knowledgeService.startProcess(knowledgeBaseId, file.id);
            await loadKnowledgeBase();
            await loadBucketFiles();
        } catch (err) {
            console.error('Erro ao processar arquivo:', err);
            setError('Erro ao processar arquivo');
        } finally {
            setLoading(false);
        }
    };

    if (!knowledgeBase) {
        return <div className="text-center py-8 text-gray-500 dark:text-gray-400">Carregando base de conhecimento...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{knowledgeBase.name}</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-2">{knowledgeBase.description}</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(knowledgeBase.status)}`}>
                    {getStatusText(knowledgeBase.status)}
                </span>
            </div>

            {error && <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Arquivos Disponíveis</h2>
                    <div className="flex items-center gap-4">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            disabled={uploading}
                            className="block w-full text-sm text-gray-500 dark:text-gray-400
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-primary-50 file:text-primary-700
                                hover:file:bg-primary-100
                                dark:file:bg-primary-900 dark:file:text-primary-300"
                        />
                        {selectedFile && (
                            <button
                                onClick={handleUpload}
                                disabled={uploading}
                                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 
                                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                                    disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploading ? 'Enviando...' : 'Enviar'}
                            </button>
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/3">
                                    Nome do Arquivo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/6">
                                    Tamanho
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/6">
                                    Tipo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/6">
                                    Última Modificação
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/12">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/12">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {bucketFiles.map((file) => (
                                <tr key={file.id}>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white max-w-[300px]">
                                        <div className="flex items-center">
                                            <DocumentIcon className="h-5 w-5 mr-2 flex-shrink-0 text-gray-400" />
                                            <span className="truncate" title={file.originalName}>
                                                {file.originalName}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {formatFileSize(file.size)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        <span className="truncate block max-w-[100px]" title={file.mimeType}>
                                            {file.mimeType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(file.lastModified).toLocaleDateString('pt-BR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            file.status === 'available' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                            file.status === 'processing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                                            'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                                        }`}>
                                            {file.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleProcessBucketFile(file)}
                                                disabled={loading || file.status === 'processing'}
                                                className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300
                                                    disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Processar Arquivo"
                                            >
                                                <PlayIcon className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDownload(file)}
                                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                title="Download"
                                            >
                                                <ArrowDownTrayIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
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

export default KnowledgeBaseDatasetUpload;