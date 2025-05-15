import { useTranslation } from 'react-i18next';
import type { ChatbotStatus } from '../../../types/chatbot';

interface ChatbotStatusBadgeProps {
  status: ChatbotStatus;
}

export function ChatbotStatusBadge({ status }: ChatbotStatusBadgeProps) {
  const { t } = useTranslation('chatbots');

  const statusStyles = {
    active: 'bg-green-50 text-green-700 ring-green-600/20',
    inactive: 'bg-gray-50 text-gray-600 ring-gray-500/10',
  };

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
        statusStyles[status]
      }`}
    >
      {t(`status.${status}`)}
    </span>
  );
} 