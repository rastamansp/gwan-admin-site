import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import KnowledgeService, { KnowledgeBase, BucketFile } from '../services/knowledge.service';
import { formatFileSize } from '../../../utils/format';
import { TrashIcon, PlayIcon, ArrowDownTrayIcon, DocumentIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// Tipos de arquivo permitidos
const ALLOWED_FILE_TYPES = [
    // PDF
    'application/pdf',
    // Documentos do Office
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPTX
    // Markdown
    'text/markdown',
    'text/x-markdown',
    // AsciiDoc
    'text/asciidoc',
    'text/x-asciidoc',
    // HTML
    'text/html',
    'application/xhtml+xml',
    // CSV
    'text/csv',
    'application/csv',
    // Imagens
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/tiff',
    'image/bmp',
    'image/webp'
];

// Extensões permitidas para validação adicional
const ALLOWED_EXTENSIONS = [
    '.pdf', '.docx', '.xlsx', '.pptx', '.md', '.markdown', 
    '.adoc', '.asciidoc', '.html', '.htm', '.xhtml', '.csv',
    '.png', '.jpg', '.jpeg', '.tiff', '.bmp', '.webp'
];

const KnowledgeBaseDatasetUpload: React.FC = () => {
    const { knowledgeBaseId } = useParams<{ knowledgeBaseId: string }>();
    const navigate = useNavigate();
    const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase | null>(null);
    const [bucketFiles, setBucketFiles] = useState<BucketFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
    const knowledgeService = KnowledgeService.getInstance();

    const loadBucketFiles = useCallback(async () => {
        if (!knowledgeBaseId) return;
        try {
            setLoading(true);
            const files = await knowledgeService.listBucketFiles(knowledgeBaseId);
            setBucketFiles(files);
        } catch {
            setError('Erro ao carregar arquivos do bucket');
        } finally {
            setLoading(false);
        }
    }, [knowledgeService, knowledgeBaseId]);

    const loadKnowledgeBase = useCallback(async () => {
        if (!knowledgeBaseId) return;
        try {
            setLoading(true);
            const bases = await knowledgeService.listKnowledgeBases();
            const base = bases.find(b => b._id === knowledgeBaseId) || null;
            setKnowledgeBase(base);
        } catch {
            setError('Erro ao carregar base de conhecimento');
        } finally {
            setLoading(false);
        }
    }, [knowledgeService, knowledgeBaseId]);

    useEffect(() => {
        if (knowledgeBaseId) {
            loadBucketFiles();
            loadKnowledgeBase();
        }
    }, [knowledgeBaseId, loadBucketFiles, loadKnowledgeBase]);

    const validateFile = (file: File): string | null => {
        // Verificar tipo MIME
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            // Verificar extensão como fallback
            const extension = '.' + file.name.split('.').pop()?.toLowerCase();
            if (!ALLOWED_EXTENSIONS.includes(extension)) {
                return 'Tipo de arquivo não suportado. Formatos aceitos: PDF, DOCX, XLSX, PPTX, Markdown, AsciiDoc, HTML, CSV, PNG, JPEG, TIFF, BMP, WEBP';
            }
        }

        // Verificar tamanho (máximo 50MB)
        const maxSize = 50 * 1024 * 1024; // 50MB
        if (file.size > maxSize) {
            return 'Arquivo muito grande. Tamanho máximo permitido: 50MB';
        }

        return null;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const validationError = validateFile(file);
            
            if (validationError) {
                setError(validationError);
                setSelectedFile(null);
                // Limpar o input
                e.target.value = '';
                return;
            }
            
            setSelectedFile(file);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !knowledgeBaseId) return;
        setUploading(true);
        try {
            await knowledgeService.addRawFile(knowledgeBaseId, selectedFile);
            setSelectedFile(null);
            await Promise.all([
                loadKnowledgeBase(),
                loadBucketFiles()
            ]);
            setError(null);
        } catch (err) {
            console.error('Erro ao enviar arquivo:', err);
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

    const handleDeleteFile = async (file: BucketFile) => {
        if (!knowledgeBaseId || !window.confirm(`Tem certeza que deseja excluir o arquivo "${file.originalName}"?`)) {
            return;
        }

        try {
            setDeletingFileId(file.id);
            await knowledgeService.deleteBucketFile(knowledgeBaseId, file.id);
            await loadBucketFiles();
            setError(null);
        } catch (err) {
            console.error('Erro ao excluir arquivo:', err);
            setError('Erro ao excluir arquivo');
        } finally {
            setDeletingFileId(null);
        }
    };

    const handleNavigateToSearch = () => {
        if (knowledgeBaseId) {
            navigate(`/datasets/${knowledgeBaseId}/search`);
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
                <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(knowledgeBase.status)}`}>
                        {getStatusText(knowledgeBase.status)}
                    </span>
                    <button
                        onClick={handleNavigateToSearch}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        <MagnifyingGlassIcon className="h-4 w-4 mr-1" />
                        Buscar Conhecimento
                    </button>
                </div>
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
                            accept={ALLOWED_FILE_TYPES.join(',')}
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

                {/* Informações sobre tipos de arquivo aceitos */}
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md dark:bg-blue-900/50 dark:border-blue-800">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        <strong>Tipos de arquivo aceitos:</strong> PDF, DOCX, XLSX, PPTX, Markdown, AsciiDoc, HTML, CSV, PNG, JPEG, TIFF, BMP, WEBP (máximo 50MB)
                    </p>
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
                                            <button
                                                onClick={() => handleDeleteFile(file)}
                                                disabled={deletingFileId === file.id}
                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300
                                                    disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Excluir Arquivo"
                                            >
                                                <TrashIcon className="h-5 w-5" />
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