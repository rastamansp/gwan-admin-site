import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { ChatbotTable } from '../../components/modules/chatbots/ChatbotTable';
import { ChatbotForm } from '../../components/modules/chatbots/ChatbotForm';
import { useChatbotService } from '../../hooks/useChatbotService';
import type { Chatbot, CreateChatbotDto, ChatbotStatus } from '../../types/chatbot';

export default function ChatbotList() {
  const { t } = useTranslation('chatbots');
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedChatbot, setSelectedChatbot] = useState<Chatbot | null>(null);
  const chatbotService = useChatbotService();

  useEffect(() => {
    loadChatbots();
  }, []);

  const loadChatbots = async () => {
    try {
      setIsLoading(true);
      const data = await chatbotService.listChatbots();
      setChatbots(data);
      setError(null);
    } catch (err) {
      setError(t('errors.loadFailed'));
      console.error('Error loading chatbots:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data: CreateChatbotDto) => {
    try {
      await chatbotService.createChatbot(data);
      setIsFormOpen(false);
      loadChatbots();
    } catch (err) {
      setError(t('errors.createFailed'));
      console.error('Error creating chatbot:', err);
    }
  };

  const handleEdit = async (data: CreateChatbotDto) => {
    if (!selectedChatbot) return;
    try {
      await chatbotService.updateChatbot(selectedChatbot.id, data);
      setIsFormOpen(false);
      setSelectedChatbot(null);
      loadChatbots();
    } catch (err) {
      setError(t('errors.updateFailed'));
      console.error('Error updating chatbot:', err);
    }
  };

  const handleStatusChange = async (id: string, status: ChatbotStatus) => {
    try {
      await chatbotService.changeChatbotStatus(id, status);
      loadChatbots();
    } catch (err) {
      setError(t('errors.statusChangeFailed'));
      console.error('Error changing chatbot status:', err);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">{t('title')}</h1>
          <p className="mt-2 text-sm text-gray-700">{t('description')}</p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button
            type="button"
            onClick={() => {
              setSelectedChatbot(null);
              setIsFormOpen(true);
            }}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            {t('actions.create')}
          </Button>
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
        <ChatbotTable
          chatbots={chatbots}
          isLoading={isLoading}
          onEdit={(chatbot) => {
            setSelectedChatbot(chatbot);
            setIsFormOpen(true);
          }}
          onStatusChange={handleStatusChange}
        />
      </div>

      <ChatbotForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedChatbot(null);
        }}
        onSubmit={selectedChatbot ? handleEdit : handleCreate}
        chatbot={selectedChatbot}
      />
    </div>
  );
} 