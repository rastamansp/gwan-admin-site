import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { CrawlingRequest, CrawlingFormat } from '../../types/crawling';
import { useCreateCrawling } from '../../hooks/useCrawling';

const createCrawlingSchema = z.object({
  url: z.string().url('URL inválida'),
  formats: z.array(z.enum(['json', 'markdown'])).min(1, 'Selecione pelo menos um formato'),
  jsonSchema: z.string().optional(),
});

type CreateCrawlingFormData = z.infer<typeof createCrawlingSchema>;

interface CreateCrawlingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateCrawlingModal: React.FC<CreateCrawlingModalProps> = ({ isOpen, onClose }) => {
  const [selectedFormats, setSelectedFormats] = useState<CrawlingFormat[]>([]);
  const createCrawling = useCreateCrawling();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateCrawlingFormData>({
    resolver: zodResolver(createCrawlingSchema),
    defaultValues: {
      formats: [],
    },
  });

  const handleFormatToggle = (format: CrawlingFormat) => {
    const newFormats = selectedFormats.includes(format)
      ? selectedFormats.filter(f => f !== format)
      : [...selectedFormats, format];
    
    setSelectedFormats(newFormats);
    setValue('formats', newFormats);
  };

  const onSubmit = async (data: CreateCrawlingFormData) => {
    try {
      const request: CrawlingRequest = {
        url: data.url,
        formats: data.formats,
        jsonSchema: data.jsonSchema || undefined,
      };

      await createCrawling.mutateAsync(request);
      reset();
      setSelectedFormats([]);
      onClose();
    } catch (error) {
      console.error('Erro ao criar crawling:', error);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedFormats([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md w-full bg-white rounded-lg shadow-xl">
          <div className="flex items-center justify-between p-6 border-b">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              Novo Crawling
            </Dialog.Title>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                URL *
              </label>
              <input
                {...register('url')}
                type="url"
                id="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="https://exemplo.com"
              />
              {errors.url && (
                <p className="mt-1 text-sm text-red-600">{errors.url.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Formatos *
              </label>
              <div className="space-y-2">
                {(['json', 'markdown'] as CrawlingFormat[]).map((format) => (
                  <label key={format} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedFormats.includes(format)}
                      onChange={() => handleFormatToggle(format)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">
                      {format}
                    </span>
                  </label>
                ))}
              </div>
              {errors.formats && (
                <p className="mt-1 text-sm text-red-600">{errors.formats.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="jsonSchema" className="block text-sm font-medium text-gray-700 mb-1">
                JSON Schema (opcional)
              </label>
              <textarea
                {...register('jsonSchema')}
                id="jsonSchema"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Insira o JSON Schema se necessário..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={createCrawling.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createCrawling.isPending ? 'Criando...' : 'Criar'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}; 