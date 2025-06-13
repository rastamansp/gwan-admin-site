import { useState } from 'react';
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';

interface CodeBlockProps {
  code: string;
  language: 'json' | 'markdown' | 'text';
  title?: string;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ 
  code, 
  language, 
  title, 
  className = '' 
}) => {
  const [copied, setCopied] = useState(false);

  const formatCode = (code: string, lang: string) => {
    if (lang === 'json') {
      try {
        return JSON.stringify(JSON.parse(code), null, 2);
      } catch {
        return code;
      }
    }
    return code;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar para clipboard:', error);
    }
  };

  const getLanguageLabel = () => {
    switch (language) {
      case 'json':
        return 'JSON';
      case 'markdown':
        return 'Markdown';
      default:
        return 'Text';
    }
  };

  const getLanguageColor = () => {
    switch (language) {
      case 'json':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'markdown':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className={`bg-gray-50 rounded-lg border ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          {title && (
            <span className="text-sm font-medium text-gray-700">{title}</span>
          )}
          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getLanguageColor()}`}>
            {getLanguageLabel()}
          </span>
        </div>
        <button
          onClick={copyToClipboard}
          className="inline-flex items-center px-2 py-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          title="Copiar código"
        >
          {copied ? (
            <CheckIcon className="h-4 w-4 text-green-600" />
          ) : (
            <ClipboardIcon className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm text-gray-900 whitespace-pre-wrap font-mono">
          {formatCode(code, language)}
        </pre>
      </div>
    </div>
  );
}; 