import React, { useState, useEffect } from 'react';
import { DatasetService, DatasetFile } from '../services/dataset.service';
import { formatFileSize } from '../utils/format';
import { useTranslation } from 'react-i18next';

const DatasetUpload: React.FC = () => {
    const { t } = useTranslation();
    const [files, setFiles] = useState<DatasetFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const datasetService = DatasetService.getInstance();

    useEffect(() => {
        loadFiles();
    }, []);

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

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (file.type !== 'application/pdf') {
            setError('Apenas arquivos PDF são permitidos');
            setSelectedFile(null);
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('O arquivo deve ter no máximo 5MB');
            setSelectedFile(null);
            return;
        }

        setSelectedFile(file);
        setError(null);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Selecione um arquivo para enviar');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setUploadProgress(0);

            const uploadedFile = await datasetService.uploadFile(selectedFile);
            setFiles(prev => [uploadedFile, ...prev]);
            setUploadProgress(100);
            setSelectedFile(null);
            
            // Reset file input
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (fileInput) {
                fileInput.value = '';
            }
        } catch (err) {
            setError('Erro ao fazer upload do arquivo');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Upload de Datasets</h1>

            {/* Upload Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">
                        Selecione um arquivo PDF
                    </label>
                    <div className="flex items-center gap-4">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileSelect}
                            disabled={loading}
                            className="block w-full text-sm text-gray-500 dark:text-gray-300
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 dark:file:bg-blue-900
                                file:text-blue-700 dark:file:text-blue-200
                                hover:file:bg-blue-100 dark:hover:file:bg-blue-800"
                        />
                        <button
                            onClick={handleUpload}
                            disabled={!selectedFile || loading}
                            className={`
                                px-4 py-2 rounded-md text-sm font-semibold
                                ${!selectedFile || loading
                                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800'
                                }
                            `}
                        >
                            {loading ? 'Enviando...' : 'Enviar'}
                        </button>
                    </div>
                </div>

                {selectedFile && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Arquivo selecionado: <span className="font-medium">{selectedFile.name}</span>
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Tamanho: <span className="font-medium">{formatFileSize(selectedFile.size)}</span>
                        </p>
                    </div>
                )}

                {error && (
                    <div className="mt-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative">
                        {error}
                    </div>
                )}

                {loading && (
                    <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div
                            className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                )}
            </div>

            {/* Files List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Arquivos Enviados</h2>
                {loading && files.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">Carregando arquivos...</p>
                ) : files.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">Nenhum arquivo enviado ainda.</p>
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
                                        Data
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
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {file.originalname || file.filename}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {formatFileSize(file.size)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {file.createdAt ? new Date(file.createdAt).toLocaleDateString('pt-BR') : 
                                                 file.lastModified ? new Date(file.lastModified).toLocaleDateString('pt-BR') : 
                                                 'Data não disponível'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <a
                                                href={file.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                                            >
                                                Visualizar
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DatasetUpload; 