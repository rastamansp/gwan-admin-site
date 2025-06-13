import React, { useState, useEffect, useCallback } from 'react';
import { Dialog } from '@headlessui/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useParams, useNavigate } from 'react-router-dom';
import { Listbox, Transition, Switch } from '@headlessui/react';
import { ChevronUpDownIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { 
    PencilSquareIcon,
    DocumentTextIcon,
    TrashIcon
} from '@heroicons/react/24/outline';
import KnowledgeService, { KnowledgeBase, SimilarResult } from '../services/knowledge.service';

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (content: string, enable: boolean) => Promise<void>;
    initialContent: string;
    initialEnable: boolean;
    fileName: string;
}

const EditModal: React.FC<EditModalProps> = ({ 
    isOpen, 
    onClose, 
    onSave, 
    initialContent, 
    initialEnable,
    fileName 
}) => {
    const [content, setContent] = useState(initialContent);
    const [enable, setEnable] = useState(initialEnable);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setContent(initialContent);
            setEnable(initialEnable);
            setError(null);
        }
    }, [isOpen, initialContent, initialEnable]);

    const handleSave = async () => {
        if (!content.trim()) {
            setError('O conteúdo não pode estar vazio');
            return;
        }

        setIsSaving(true);
        setError(null);
        try {
            await onSave(content, enable);
            onClose();
        } catch (err) {
            setError('Erro ao salvar as alterações');
            console.error('Erro ao salvar:', err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog 
            open={isOpen} 
            onClose={onClose}
            className="relative z-50"
        >
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                        <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                            Editar Conteúdo - {fileName}
                        </Dialog.Title>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="p-4">
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md dark:bg-red-900/50 dark:border-red-800 dark:text-red-400">
                                {error}
                            </div>
                        )}
                        
                        <div className="mb-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Status
                                </label>
                                <Switch
                                    checked={enable}
                                    onChange={setEnable}
                                    className={`${
                                        enable ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                                >
                                    <span
                                        className={`${
                                            enable ? 'translate-x-6' : 'translate-x-1'
                                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                    />
                                </Switch>
                            </div>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {enable ? 'Conteúdo ativo e disponível para busca' : 'Conteúdo inativo e oculto das buscas'}
                            </p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Conteúdo
                            </label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full h-64 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Digite o conteúdo..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving || (content === initialContent && enable === initialEnable)}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-primary-500 dark:hover:bg-primary-600"
                        >
                            {isSaving ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

const KnowledgeBaseSearch: React.FC = () => {
    const { knowledgeBaseId: initialKnowledgeBaseId } = useParams<{ knowledgeBaseId: string }>();
    const navigate = useNavigate();
    const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
    const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState<KnowledgeBase | null>(null);
    const [similarText, setSimilarText] = useState('');
    const [similarResults, setSimilarResults] = useState<SimilarResult[]>([]);
    const [similarLoading, setSimilarLoading] = useState(false);
    const [similarError, setSimilarError] = useState<string | null>(null);
    const [loadingBases, setLoadingBases] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [isToggling, setIsToggling] = useState<string | null>(null);
    const [editingResult, setEditingResult] = useState<SimilarResult | null>(null);
    const knowledgeService = KnowledgeService.getInstance();

    const loadKnowledgeBases = useCallback(async () => {
        setLoadingBases(true);
        try {
            const bases = await knowledgeService.listKnowledgeBases();
            setKnowledgeBases(bases);
            
            // Se tiver um ID inicial, seleciona a base correspondente
            if (initialKnowledgeBaseId) {
                const base = bases.find(b => b._id === initialKnowledgeBaseId);
                if (base) {
                    setSelectedKnowledgeBase(base);
                }
            } else if (bases.length > 0) {
                // Se não tiver ID inicial, seleciona a primeira base
                setSelectedKnowledgeBase(bases[0]);
            }
        } catch (err) {
            console.error('Erro ao carregar bases de conhecimento:', err);
            setSimilarError('Erro ao carregar bases de conhecimento');
        } finally {
            setLoadingBases(false);
        }
    }, [knowledgeService, initialKnowledgeBaseId]);

    useEffect(() => {
        loadKnowledgeBases();
    }, [loadKnowledgeBases]);

    useEffect(() => {
        if (initialKnowledgeBaseId && knowledgeBases.length > 0) {
            const base = knowledgeBases.find(b => b._id === initialKnowledgeBaseId);
            if (base) {
                setSelectedKnowledgeBase(base);
            }
        }
    }, [initialKnowledgeBaseId, knowledgeBases]);

    const handleKnowledgeBaseChange = (base: KnowledgeBase) => {
        setSelectedKnowledgeBase(base);
        setSimilarResults([]); // Limpa os resultados ao trocar de base
        navigate(`/datasets/${base._id}/search`);
    };

    const handleFindSimilar = async () => {
        if (!selectedKnowledgeBase?._id || !similarText.trim()) return;
        
        setSimilarLoading(true);
        setSimilarError(null);
        
        try {
            const results = await knowledgeService.findSimilar(selectedKnowledgeBase._id, similarText);
            setSimilarResults(results);
        } catch (err) {
            console.error('Erro ao buscar conteúdo similar:', err);
            setSimilarError('Erro ao buscar conteúdo similar');
        } finally {
            setSimilarLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
        } catch {
            return dateString;
        }
    };

    const handleEdit = (result: SimilarResult) => {
        setEditingResult(result);
    };

    const handleSaveEdit = async (content: string, enable: boolean) => {
        if (!editingResult) return;
        
        try {
            // TODO: Implementar chamada à API
            console.log('Salvando edição:', { id: editingResult.id, content, enable });
            // Atualizar o resultado na lista
            setSimilarResults(prev => 
                prev.map(result => 
                    result.id === editingResult.id 
                        ? { ...result, content, enable } 
                        : result
                )
            );
        } finally {
            setEditingResult(null);
        }
    };

    const handleDelete = async (resultId: string) => {
        if (!selectedKnowledgeBase?._id) return;
        
        setIsDeleting(resultId);
        try {
            // Atualizar o estado otimisticamente
            setSimilarResults(prev => prev.filter(r => r.id !== resultId));

            // Chamar a API
            await knowledgeService.deleteChunk(
                selectedKnowledgeBase._id,
                resultId
            );
        } catch (err) {
            console.error('Erro ao excluir chunk:', err);
            // Reverter o estado em caso de erro
            setSimilarResults(prev => [...prev, similarResults.find(r => r.id === resultId)!]);
            setSimilarError('Erro ao excluir conteúdo');
        } finally {
            setIsDeleting(null);
        }
    };

    const handleToggleActive = async (resultId: string) => {
        if (!selectedKnowledgeBase?._id) return;
        
        setIsToggling(resultId);
        try {
            const result = similarResults.find(r => r.id === resultId);
            if (!result) return;

            // Atualizar o estado otimisticamente
            setSimilarResults(prev => 
                prev.map(r => 
                    r.id === resultId 
                        ? { ...r, enable: !r.enable }
                        : r
                )
            );

            // Chamar a API
            await knowledgeService.updateChunkStatus(
                selectedKnowledgeBase._id,
                resultId,
                !result.enable
            );
        } catch (err) {
            console.error('Erro ao atualizar status do chunk:', err);
            // Reverter o estado em caso de erro
            setSimilarResults(prev => 
                prev.map(r => 
                    r.id === resultId 
                        ? { ...r, enable: !r.enable }
                        : r
                )
            );
            setSimilarError('Erro ao atualizar status do conteúdo');
        } finally {
            setIsToggling(null);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Busca por Similaridade</h1>
                
                {/* Seletor de Base de Conhecimento */}
                <div className="mb-6">
                    <label htmlFor="knowledge-base" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Base de Conhecimento
                    </label>
                    <Listbox value={selectedKnowledgeBase} onChange={handleKnowledgeBaseChange}>
                        <div className="relative mt-1">
                            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white dark:bg-gray-700 py-2 pl-3 pr-10 text-left border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm">
                                <span className="block truncate text-gray-900 dark:text-white">
                                    {selectedKnowledgeBase ? selectedKnowledgeBase.name : 'Selecione uma base de conhecimento'}
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </span>
                            </Listbox.Button>
                            <Transition
                                as={React.Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {loadingBases ? (
                                        <div className="relative cursor-default select-none py-2 px-4 text-gray-700 dark:text-gray-300">
                                            Carregando bases...
                                        </div>
                                    ) : knowledgeBases.length === 0 ? (
                                        <div className="relative cursor-default select-none py-2 px-4 text-gray-700 dark:text-gray-300">
                                            Nenhuma base de conhecimento encontrada
                                        </div>
                                    ) : (
                                        knowledgeBases.map((base) => (
                                            <Listbox.Option
                                                key={base._id}
                                                className={({ active }) =>
                                                    `relative cursor-default select-none py-2 pl-4 pr-4 ${
                                                        active ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100' : 'text-gray-900 dark:text-gray-100'
                                                    }`
                                                }
                                                value={base}
                                            >
                                                {({ selected }) => (
                                                    <>
                                                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                            {base.name}
                                                        </span>
                                                    </>
                                                )}
                                            </Listbox.Option>
                                        ))
                                    )}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </Listbox>
                </div>

                {/* Área de Busca */}
                <div className="flex gap-4 mb-6">
                    <textarea
                        value={similarText}
                        onChange={(e) => setSimilarText(e.target.value)}
                        placeholder="Cole aqui o texto para encontrar conteúdo similar..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white min-h-[100px]"
                        disabled={!selectedKnowledgeBase}
                    />
                    <button
                        onClick={handleFindSimilar}
                        disabled={similarLoading || !similarText.trim() || !selectedKnowledgeBase}
                        className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                            disabled:opacity-50 disabled:cursor-not-allowed self-start"
                    >
                        {similarLoading ? 'Buscando...' : 'Buscar Similar'}
                    </button>
                </div>

                {similarError && (
                    <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {similarError}
                    </div>
                )}

                {/* Nova visualização em tabela */}
                <div className="mt-6">
                    {similarResults.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/4">
                                            Arquivo
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-3/5">
                                            Conteúdo
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/12">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {similarResults.map((result) => (
                                        <tr key={result.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                <div className="flex items-center">
                                                    <DocumentTextIcon className="h-5 w-5 mr-2 flex-shrink-0 text-gray-400" />
                                                    <div className="flex flex-col">
                                                        <span className="truncate max-w-[200px]" title={result.meta.fileName}>
                                                            {result.meta.fileName}
                                                        </span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            Chunk {result.meta.chunkIndex + 1} de {result.meta.totalChunks}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                <div className="line-clamp-3" title={result.content}>
                                                    {result.content}
                                                </div>
                                                <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                                                    Processado em: {formatDate(result.meta.processedAt)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-4">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleEdit(result)}
                                                            className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                                                            title="Editar"
                                                        >
                                                            <PencilSquareIcon className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(result.id)}
                                                            disabled={isDeleting === result.id}
                                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                                                            title="Excluir"
                                                        >
                                                            <TrashIcon className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Switch
                                                            checked={result.enable}
                                                            onChange={() => handleToggleActive(result.id)}
                                                            disabled={isToggling === result.id}
                                                            className={`${
                                                                result.enable ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'
                                                            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                                                        >
                                                            <span
                                                                className={`${
                                                                    result.enable ? 'translate-x-6' : 'translate-x-1'
                                                                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                                            />
                                                        </Switch>
                                                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                                            {result.enable ? 'Ativo' : 'Inativo'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    
                    {!similarLoading && similarResults.length === 0 && similarText && (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            Nenhum conteúdo similar encontrado.
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Edição */}
            <EditModal
                isOpen={!!editingResult}
                onClose={() => setEditingResult(null)}
                onSave={handleSaveEdit}
                initialContent={editingResult?.content || ''}
                initialEnable={editingResult?.enable ?? true}
                fileName={editingResult?.meta.fileName || ''}
            />
        </div>
    );
};

export default KnowledgeBaseSearch;