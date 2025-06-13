import { CrawlingStatus } from '../types/crawling';

interface StatusBadgeProps {
  status: CrawlingStatus;
}

const statusConfig = {
  pending: {
    label: 'Pendente',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  processing: {
    label: 'Processando',
    className: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  completed: {
    label: 'Concluído',
    className: 'bg-green-100 text-green-800 border-green-200'
  },
  failed: {
    label: 'Falhou',
    className: 'bg-red-100 text-red-800 border-red-200'
  }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status as keyof typeof statusConfig];
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}>
      {config.label}
    </span>
  );
}; 