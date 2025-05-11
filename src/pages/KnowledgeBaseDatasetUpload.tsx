import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import KnowledgeService, { KnowledgeBase, KnowledgeFile } from '../services/knowledge.service';
import { formatFileSize } from '../utils/format';
import { TrashIcon, PlayIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const KnowledgeBaseDatasetUpload: React.FC = () => {
    const { knowledgeBaseId } = useParams<{ knowledgeBaseId: string }>();
    const navigate = useNavigate();
    const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const knowledgeService = KnowledgeService.getInstance();

    useEffect(() => {
        if (knowledgeBaseId) {
            loadKnowledgeBase();
        }
    }, [knowledgeBaseId]);

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

    const handleProcess = async (file: KnowledgeFile) => {
        if (!knowledgeBaseId) return;
        setLoading(true);
        try {
            await knowledgeService.processFile(knowledgeBaseId, file.id, { originalFileId: file.id, name: file.name });
            await loadKnowledgeBase();
        } catch (err) {
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
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${knowledgeBase.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : knowledgeBase.status === 'processing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : knowledgeBase.status === 'new' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>{knowledgeBase.status}</span>
            </div>
            {error && <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Arquivos Brutos</h2>
                <ul className="mb-2">
                    {knowledgeBase.rawFiles && knowledgeBase.rawFiles.length > 0 ? knowledgeBase.rawFiles.map(file => (
                        <li key={file.id} className="flex items-center gap-2 mb-1">
                            <span>{file.name} ({formatFileSize(file.size)})</span>
                            <button onClick={() => handleProcess(file)} className="ml-2 text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-xs border px-2 py-1 rounded disabled:opacity-50" disabled={loading}>Processar</button>
                        </li>
                    )) : <span className="text-gray-500">Nenhum arquivo bruto enviado</span>}
                </ul>
                <input type="file" onChange={handleFileChange} disabled={uploading} />
                {selectedFile && (
                    <button onClick={handleUpload} disabled={uploading} className="ml-2 px-2 py-1 bg-blue-600 text-white rounded">Enviar</button>
                )}
            </div>
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Arquivos Processados</h2>
                <ul>
                    {knowledgeBase.processedFiles && knowledgeBase.processedFiles.length > 0 ? knowledgeBase.processedFiles.map(file => (
                        <li key={file.id} className="flex items-center gap-2 mb-1">
                            <span>{file.name} ({formatFileSize(file.size)})</span>
                            {/* Aqui você pode adicionar ações para download ou visualização do arquivo processado */}
                        </li>
                    )) : <span className="text-gray-500">Nenhum arquivo processado</span>}
                </ul>
            </div>
        </div>
    );
};

export default KnowledgeBaseDatasetUpload;