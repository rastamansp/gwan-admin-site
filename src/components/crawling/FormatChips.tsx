import { CrawlingFormat } from '../../types/crawling';

interface FormatChipsProps {
  formats: CrawlingFormat[];
}

const formatConfig = {
  json: {
    label: 'JSON',
    className: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  markdown: {
    label: 'Markdown',
    className: 'bg-gray-100 text-gray-800 border-gray-200'
  }
};

export const FormatChips: React.FC<FormatChipsProps> = ({ formats }) => {
  return (
    <div className="flex flex-wrap gap-1">
      {formats.map((format) => {
        const config = formatConfig[format];
        return (
          <span
            key={format}
            className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${config.className}`}
          >
            {config.label}
          </span>
        );
      })}
    </div>
  );
}; 