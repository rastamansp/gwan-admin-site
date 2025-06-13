import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ArrowPathIcon, DocumentTextIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useCrawling } from '../hooks/useCrawling';
import { StatusBadge } from '../components/crawling/StatusBadge';
import { CodeBlock } from '../components/common/CodeBlock';

export const CrawlingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: crawling, isLoading, error, refetch } = useCrawling(id!);

  const handleBack = () => {
    navigate('/crawling');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !crawling) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Erro ao carregar crawling
              </h3>
              <p className="text-gray-600 mb-4">
                Ocorreu um erro ao carregar os detalhes do crawling.
              </p>
              <div className="space-x-3">
                <button
                  onClick={() => refetch()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                  Tentar novamente
                </button>
                <button
                  onClick={handleBack}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  Voltar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="inline-flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Voltar
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Detalhes do Crawling</h1>
                <p className="mt-1 text-gray-600">ID: {crawling.id}</p>
              </div>
            </div>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Atualizar
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Informações Básicas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">URL</label>
                <p className="mt-1 text-sm text-gray-900 break-all">{crawling.url}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <div className="mt-1">
                  <StatusBadge status={crawling.status} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Criado em</label>
                <p className="mt-1 text-sm text-gray-900">
                  {format(new Date(crawling.createdAt), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Atualizado em</label>
                <p className="mt-1 text-sm text-gray-900">
                  {format(new Date(crawling.updatedAt), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}
                </p>
              </div>
            </div>
          </div>

          {/* Parâmetros da Requisição */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Parâmetros da Requisição</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Formato solicitado</label>
                <div className="text-sm text-gray-500">
                  Markdown
                </div>
              </div>
            </div>
          </div>

          {/* Resultado */}
          {crawling.status === 'completed' && crawling.result && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Resultado</h2>
              <div className="space-y-6">
                {crawling.result.data?.markdown && (
                  <div>
                    <div className="flex items-center mb-2">
                      <DocumentTextIcon className="h-5 w-5 text-gray-500 mr-2" />
                      <label className="text-sm font-medium text-gray-700">Markdown</label>
                    </div>
                    <CodeBlock
                      code={crawling.result.data.markdown}
                      language="markdown"
                      title="Resultado Markdown"
                    />
                  </div>
                )}
                {crawling.result.data?.metadata && (
                  <div>
                    <div className="flex items-center mb-2">
                      <CodeBracketIcon className="h-5 w-5 text-gray-500 mr-2" />
                      <label className="text-sm font-medium text-gray-700">Metadados</label>
                    </div>
                    <CodeBlock
                      code={JSON.stringify(crawling.result.data.metadata, null, 2)}
                      language="json"
                      title="Metadados"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Erro */}
          {crawling.status === 'failed' && crawling.error && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Erro</h2>
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Erro no processamento</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <CodeBlock
                        code={crawling.error}
                        language="text"
                        title="Mensagem de Erro"
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 