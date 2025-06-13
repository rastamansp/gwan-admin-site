import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ChatbotForm } from '../components/ChatbotForm';
import { N8nConfigForm } from '../components/N8nConfigForm';
import { VectorConfigForm } from '../components/VectorConfigForm';
import type { Chatbot, CreateChatbotDto, UpdateN8nConfigDto, UpdateVectorConfigDto, UpdateStatusDto } from '../types/chatbot';
import { chatbotService } from '../services/chatbotService';
import { PencilIcon, TrashIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { Switch } from '@headlessui/react';
import { toast } from 'react-toastify';

export default function ChatbotsPage() {
  const { t } = useTranslation('chatbots');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isN8nConfigOpen, setIsN8nConfigOpen] = useState(false);
  const [isVectorConfigOpen, setIsVectorConfigOpen] = useState(false);
  const [selectedChatbot, setSelectedChatbot] = useState<Chatbot | null>(null);
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChatbots = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await chatbotService.list();
      setChatbots(response);
    } catch (error) {
      console.error('Erro ao carregar chatbots:', error);
      toast.error('Erro ao carregar chatbots');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchChatbots(); }, [fetchChatbots]);

  const handleCreateChatbot = async (data: CreateChatbotDto) => {
    try {
      setError(null);
      const newChatbot = await chatbotService.create(data);
      setChatbots([...chatbots, newChatbot]);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error creating chatbot:', error);
      setError(t('error.create'));
    }
  };

  const handleEditChatbot = async (data: CreateChatbotDto) => {
    if (!selectedChatbot) return;
    
    try {
      setError(null);
      const updatedChatbot = await chatbotService.update(selectedChatbot.id, data);
      setChatbots(chatbots.map(c => c.id === selectedChatbot.id ? updatedChatbot : c));
      setIsFormOpen(false);
      setSelectedChatbot(null);
    } catch (error) {
      console.error('Error updating chatbot:', error);
      setError(t('error.update'));
    }
  };

  const handleUpdateN8nConfig = async (data: UpdateN8nConfigDto) => {
    if (!selectedChatbot) return;

    try {
      setError(null);
      const updatedChatbot = await chatbotService.updateN8nConfig(selectedChatbot.id, data);
      setChatbots(chatbots.map(c => c.id === selectedChatbot.id ? updatedChatbot : c));
      setIsN8nConfigOpen(false);
      setSelectedChatbot(null);
    } catch (error) {
      console.error('Error updating N8N config:', error);
      setError(t('error.updateN8n'));
    }
  };

  const handleUpdateVectorConfig = async (data: UpdateVectorConfigDto) => {
    if (!selectedChatbot) return;

    try {
      setError(null);
      const updatedChatbot = await chatbotService.updateVectorConfig(selectedChatbot.id, data);
      setChatbots(chatbots.map(c => c.id === selectedChatbot.id ? updatedChatbot : c));
      setIsVectorConfigOpen(false);
      setSelectedChatbot(null);
    } catch (error) {
      console.error('Error updating vector config:', error);
      setError(t('error.updateVector'));
    }
  };

  const handleToggleStatus = async (chatbot: Chatbot) => {
    try {
      setError(null);
      const data: UpdateStatusDto = { isActive: !chatbot.isActive };
      const updatedChatbot = await chatbotService.updateStatus(chatbot.id, data);
      setChatbots(chatbots.map(c => c.id === chatbot.id ? updatedChatbot : c));
    } catch (error) {
      console.error('Error updating chatbot status:', error);
      setError(t('error.updateStatus'));
    }
  };

  const handleDeleteChatbot = async (id: string) => {
    if (!confirm(t('deleteConfirm'))) return;

    try {
      setError(null);
      await chatbotService.delete(id);
      setChatbots(chatbots.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting chatbot:', error);
      setError(t('error.delete'));
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">{t('title')}</h1>
          <p className="mt-2 text-sm text-gray-700">{t('description')}</p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setSelectedChatbot(null);
              setIsFormOpen(true);
            }}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {t('createButton')}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              {isLoading ? (
                <div className="text-center py-4">{t('loading')}</div>
              ) : chatbots.length === 0 ? (
                <div className="text-center py-4">{t('noChatbots')}</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        {t('table.name')}
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        {t('table.description')}
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        {t('table.model')}
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        {t('table.status')}
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">{t('table.actions')}</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {chatbots.map((chatbot) => (
                      <tr key={chatbot.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {chatbot.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {chatbot.description}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {chatbot.aiModel}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <Switch
                            checked={chatbot.isActive}
                            onChange={() => handleToggleStatus(chatbot)}
                            className={`${
                              chatbot.isActive ? 'bg-indigo-600' : 'bg-gray-200'
                            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2`}
                          >
                            <span
                              className={`${
                                chatbot.isActive ? 'translate-x-5' : 'translate-x-0'
                              } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                            />
                          </Switch>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedChatbot(chatbot);
                              setIsFormOpen(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            <PencilIcon className="h-5 w-5" aria-hidden="true" />
                            <span className="sr-only">{t('edit')}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedChatbot(chatbot);
                              setIsN8nConfigOpen(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            <Cog6ToothIcon className="h-5 w-5" aria-hidden="true" />
                            <span className="sr-only">{t('configureN8n')}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedChatbot(chatbot);
                              setIsVectorConfigOpen(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            <Cog6ToothIcon className="h-5 w-5" aria-hidden="true" />
                            <span className="sr-only">{t('configureVector')}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteChatbot(chatbot.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-5 w-5" aria-hidden="true" />
                            <span className="sr-only">{t('delete')}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      <ChatbotForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedChatbot(null);
        }}
        onSubmit={selectedChatbot ? handleEditChatbot : handleCreateChatbot}
        chatbot={selectedChatbot}
      />

      <N8nConfigForm
        isOpen={isN8nConfigOpen}
        onClose={() => {
          setIsN8nConfigOpen(false);
          setSelectedChatbot(null);
        }}
        onSubmit={handleUpdateN8nConfig}
        chatbot={selectedChatbot}
      />

      <VectorConfigForm
        isOpen={isVectorConfigOpen}
        onClose={() => {
          setIsVectorConfigOpen(false);
          setSelectedChatbot(null);
        }}
        onSubmit={handleUpdateVectorConfig}
        chatbot={selectedChatbot}
      />
    </div>
  );
} 