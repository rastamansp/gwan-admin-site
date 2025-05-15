import { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { Chatbot, UpdateVectorConfigDto } from '../../../types/chatbot';
import { defaultVectorConfig } from '../../../types/chatbot';

interface VectorConfigFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateVectorConfigDto) => void;
  chatbot?: Chatbot | null;
}

export function VectorConfigForm({ isOpen, onClose, onSubmit, chatbot }: VectorConfigFormProps) {
  const { t } = useTranslation('chatbots');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateVectorConfigDto>({
    defaultValues: defaultVectorConfig,
  });

  useEffect(() => {
    if (chatbot) {
      reset({
        dataVector: chatbot.dataVector || '',
        dataVectorSize: chatbot.dataVectorSize || 1536,
        dataVectorIndex: chatbot.dataVectorIndex || '',
        dataVectorNamespace: chatbot.dataVectorNamespace || '',
        dataVectorModel: chatbot.dataVectorModel || '',
        dataVectorEmbeddingsModel: chatbot.dataVectorEmbeddingsModel || '',
      });
    } else {
      reset(defaultVectorConfig);
    }
  }, [chatbot, reset]);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
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
                    onClick={onClose}
                  >
                    <span className="sr-only">{t('form.close')}</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      {t('vector.title')}
                    </Dialog.Title>

                    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
                      <div>
                        <label htmlFor="dataVector" className="block text-sm font-medium leading-6 text-gray-900">
                          {t('vector.form.dataVector')}
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            id="dataVector"
                            {...register('dataVector', { required: t('form.required') })}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.dataVector && (
                            <p className="mt-2 text-sm text-red-600">{errors.dataVector.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="dataVectorSize" className="block text-sm font-medium leading-6 text-gray-900">
                          {t('vector.form.dataVectorSize')}
                        </label>
                        <div className="mt-2">
                          <input
                            type="number"
                            id="dataVectorSize"
                            min={1}
                            {...register('dataVectorSize', {
                              required: t('form.required'),
                              min: { value: 1, message: t('vector.form.vectorTopKMin') },
                              valueAsNumber: true
                            })}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.dataVectorSize && (
                            <p className="mt-2 text-sm text-red-600">{errors.dataVectorSize.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="dataVectorIndex" className="block text-sm font-medium leading-6 text-gray-900">
                          {t('vector.form.dataVectorIndex')}
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            id="dataVectorIndex"
                            {...register('dataVectorIndex', { required: t('form.required') })}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.dataVectorIndex && (
                            <p className="mt-2 text-sm text-red-600">{errors.dataVectorIndex.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="dataVectorNamespace" className="block text-sm font-medium leading-6 text-gray-900">
                          {t('vector.form.dataVectorNamespace')}
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            id="dataVectorNamespace"
                            {...register('dataVectorNamespace', { required: t('form.required') })}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.dataVectorNamespace && (
                            <p className="mt-2 text-sm text-red-600">{errors.dataVectorNamespace.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="dataVectorModel" className="block text-sm font-medium leading-6 text-gray-900">
                          {t('vector.form.dataVectorModel')}
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            id="dataVectorModel"
                            {...register('dataVectorModel', { required: t('form.required') })}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.dataVectorModel && (
                            <p className="mt-2 text-sm text-red-600">{errors.dataVectorModel.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="dataVectorEmbeddingsModel" className="block text-sm font-medium leading-6 text-gray-900">
                          {t('vector.form.dataVectorEmbeddingsModel')}
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            id="dataVectorEmbeddingsModel"
                            {...register('dataVectorEmbeddingsModel', { required: t('form.required') })}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.dataVectorEmbeddingsModel && (
                            <p className="mt-2 text-sm text-red-600">{errors.dataVectorEmbeddingsModel.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:w-auto"
                        >
                          {isSubmitting ? t('form.submitting') : t('form.save')}
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                          onClick={onClose}
                        >
                          {t('form.cancel')}
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
} 