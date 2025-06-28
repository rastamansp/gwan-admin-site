import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, PlusIcon, Cog6ToothIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import KnowledgeService, { KnowledgeBase } from '../services/knowledge.service';
import "../../../i18n/config";

interface CreateKnowledgeFormData {
    name: string;
    description: string;
}

interface CreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateKnowledgeFormData) => Promise<void>;
}

const CreateModal: React.FC<CreateModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateKnowledgeFormData>();

    const handleFormSubmit = async (data: CreateKnowledgeFormData) => {
        try {
            await onSubmit(data);
            reset();
        } catch (error) {
            // Erro já tratado no componente pai
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={handleClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                                    <button
                                        type="button"
                                        className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        onClick={handleClose}
                                    >
                                        <span className="sr-only">Fechar</span>
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>

                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                                        <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                            Adicionar Base de Conhecimento
                                        </Dialog.Title>

                                        <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-6 space-y-6">
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                                    Nome
                                                </label>
                                                <div className="mt-2">
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        {...register('name', { 
                                                            required: 'Nome é obrigatório',
                                                            minLength: {
                                                                value: 3,
                                                                message: 'Nome deve ter pelo menos 3 caracteres'
                                                            }
                                                        })}
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                        placeholder="Digite o nome da base de conhecimento"
                                                    />
                                                    {errors.name && (
                                                        <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                                                    Descrição
                                                </label>
                                                <div className="mt-2">
                                                    <textarea
                                                        id="description"
                                                        rows={3}
                                                        {...register('description', { 
                                                            required: 'Descrição é obrigatória',
                                                            minLength: {
                                                                value: 10,
                                                                message: 'Descrição deve ter pelo menos 10 caracteres'
                                                            }
                                                        })}
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                        placeholder="Digite uma descrição para a base de conhecimento"
                                                    />
                                                    {errors.description && (
                                                        <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isSubmitting ? 'Criando...' : 'Criar'}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                    onClick={handleClose}
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

const KnowledgeBaseList: React.FC = () => {
    const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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

    const handleCreateKnowledgeBase = async (data: CreateKnowledgeFormData) => {
        try {
            await knowledgeService.createKnowledgeBase(data.name, data.description);
            await loadKnowledgeBases(); // Recarrega a lista
            setIsCreateModalOpen(false);
            toast.success('Base de conhecimento criada com sucesso!');
        } catch (error) {
            console.error('Erro ao criar base de conhecimento:', error);
            toast.error('Erro ao criar base de conhecimento. Verifique os dados e tente novamente.');
            throw error; // Re-throw para o modal saber que houve erro
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
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Nova Base de Conhecimento
                </button>
            </div>
            
            {error && (
                <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            
            {loading ? (
                <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
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
                                        <Link 
                                            to={`/datasets/${base._id}/documents`}
                                            className="inline-flex items-center text-indigo-600 hover:text-indigo-900 mr-4"
                                        >
                                            <Cog6ToothIcon className="h-4 w-4 mr-1" />
                                            Administrar
                                        </Link>
                                        <button 
                                            className="inline-flex items-center text-red-600 hover:text-red-900"
                                            onClick={() => {
                                                // TODO: Implementar exclusão
                                                console.log('Excluir base:', base._id);
                                            }}
                                        >
                                            <TrashIcon className="h-4 w-4 mr-1" />
                                            Excluir
                                        </button>
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

            <CreateModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateKnowledgeBase}
            />
        </div>
    );
};

export default KnowledgeBaseList;