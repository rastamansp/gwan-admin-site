import { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { Chatbot, UpdateN8nConfigDto } from '../types/chatbot';
import { defaultN8nConfig } from '../types/chatbot';

interface N8nConfigFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateN8nConfigDto) => void;
  chatbot?: Chatbot | null;
}

export function N8nConfigForm({ isOpen, onClose, onSubmit, chatbot }: N8nConfigFormProps) {
  const { t } = useTranslation('chatbots');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateN8nConfigDto>({
    defaultValues: defaultN8nConfig,
  });

  useEffect(() => {
    if (chatbot) {
      reset({
        n8nId: chatbot.n8nId || '',
        n8nWorkflowId: chatbot.n8nWorkflowId || '',
        n8nChatUrl: chatbot.n8nChatUrl || '',
        n8nChatRequireButtonClicktoStart: chatbot.n8nChatRequireButtonClicktoStart,
        n8nChatTitle: chatbot.n8nChatTitle || '',
        n8nChatSubtitle: chatbot.n8nChatSubtitle || '',
        n8nChatInitialMessage: chatbot.n8nChatInitialMessage || '',
      });
    } else {
      reset(defaultN8nConfig);
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
                      {t('n8n.title')}
                    </Dialog.Title>

                    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
                      <div>
                        <label htmlFor="n8nId" className="block text-sm font-medium leading-6 text-gray-900">
                          {t('n8n.form.n8nId')}
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            id="n8nId"
                            {...register('n8nId', { required: t('form.required') })}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.n8nId && (
                            <p className="mt-2 text-sm text-red-600">{errors.n8nId.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="n8nWorkflowId" className="block text-sm font-medium leading-6 text-gray-900">
                          {t('n8n.form.n8nWorkflowId')}
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            id="n8nWorkflowId"
                            {...register('n8nWorkflowId', { required: t('form.required') })}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.n8nWorkflowId && (
                            <p className="mt-2 text-sm text-red-600">{errors.n8nWorkflowId.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="n8nChatUrl" className="block text-sm font-medium leading-6 text-gray-900">
                          {t('n8n.form.n8nChatUrl')}
                        </label>
                        <div className="mt-2">
                          <input
                            type="url"
                            id="n8nChatUrl"
                            {...register('n8nChatUrl', { required: t('form.required') })}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.n8nChatUrl && (
                            <p className="mt-2 text-sm text-red-600">{errors.n8nChatUrl.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="n8nChatTitle" className="block text-sm font-medium leading-6 text-gray-900">
                          {t('n8n.form.n8nChatTitle')}
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            id="n8nChatTitle"
                            {...register('n8nChatTitle', { required: t('form.required') })}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.n8nChatTitle && (
                            <p className="mt-2 text-sm text-red-600">{errors.n8nChatTitle.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="n8nChatSubtitle" className="block text-sm font-medium leading-6 text-gray-900">
                          {t('n8n.form.n8nChatSubtitle')}
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            id="n8nChatSubtitle"
                            {...register('n8nChatSubtitle', { required: t('form.required') })}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.n8nChatSubtitle && (
                            <p className="mt-2 text-sm text-red-600">{errors.n8nChatSubtitle.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="n8nChatInitialMessage" className="block text-sm font-medium leading-6 text-gray-900">
                          {t('n8n.form.n8nChatInitialMessage')}
                        </label>
                        <div className="mt-2">
                          <textarea
                            id="n8nChatInitialMessage"
                            rows={3}
                            {...register('n8nChatInitialMessage', { required: t('form.required') })}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.n8nChatInitialMessage && (
                            <p className="mt-2 text-sm text-red-600">{errors.n8nChatInitialMessage.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="relative flex items-start">
                        <div className="flex h-6 items-center">
                          <input
                            type="checkbox"
                            id="n8nChatRequireButtonClicktoStart"
                            {...register('n8nChatRequireButtonClicktoStart')}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                        </div>
                        <div className="ml-3 text-sm leading-6">
                          <label htmlFor="n8nChatRequireButtonClicktoStart" className="font-medium text-gray-900">
                            {t('n8n.form.n8nChatRequireButtonClicktoStart')}
                          </label>
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