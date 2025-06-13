import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, EyeIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useCrawlings } from '../hooks/useCrawling';
import { StatusBadge } from '../components/crawling/StatusBadge';
import { CreateCrawlingModal } from '../components/crawling/CreateCrawlingModal';
import { Pagination } from '../components/common/Pagination';

export const CrawlingListPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { data, isLoading, error, refetch } = useCrawlings(currentPage, itemsPerPage);

  const handleCreateSuccess = () => {
    setIsModalOpen(false);
    refetch();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const truncateUrl = (url: string, maxLength: number = 50) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Erro ao carregar crawlings
              </h3>
              <p className="text-gray-600 mb-4">
                Ocorreu um erro ao carregar a lista de crawlings.
              </p>
              <button
                onClick={() => refetch()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Crawlings</h1>
              <p className="mt-2 text-gray-600">
                Gerencie suas requisições de crawling de dados
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Novo Crawling
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white shadow rounded-lg">
          {isLoading ? (
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : !data || !data.data || data.data.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum crawling encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                Comece criando seu primeiro crawling.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Criar Crawling
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        URL
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Formato
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Criado em
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.data.map((crawling) => (
                      <tr key={crawling.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {truncateUrl(crawling.url)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={crawling.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {crawling.result?.success ? 'Markdown' : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(crawling.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link
                            to={`/crawling/${crawling.id}`}
                            className="inline-flex items-center text-blue-600 hover:text-blue-900"
                          >
                            <EyeIcon className="h-4 w-4 mr-1" />
                            Ver Detalhes
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden">
                <div className="p-4 space-y-4">
                  {data.data.map((crawling) => (
                    <div key={crawling.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {crawling.url}
                          </p>
                          <div className="mt-2 flex items-center space-x-4">
                            <StatusBadge status={crawling.status} />
                            <span className="text-sm text-gray-500">
                              {format(new Date(crawling.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                            </span>
                          </div>
                          <div className="mt-2">
                            <div className="text-sm text-gray-500">
                              {crawling.result?.success ? 'Markdown' : 'N/A'}
                            </div>
                          </div>
                        </div>
                        <Link
                          to={`/crawling/${crawling.id}`}
                          className="ml-4 inline-flex items-center text-blue-600 hover:text-blue-900"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination */}
              {data && data.total > itemsPerPage && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(data.total / itemsPerPage)}
                  onPageChange={handlePageChange}
                  totalItems={data.total}
                  itemsPerPage={itemsPerPage}
                />
              )}
            </>
          )}
        </div>

        {/* Create Modal */}
        <CreateCrawlingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
}; 