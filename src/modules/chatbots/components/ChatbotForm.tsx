import { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { Chatbot, CreateChatbotDto } from '../types/chatbot';
import { defaultChatbotValues } from '../types/chatbot';

interface ChatbotFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateChatbotDto) => void;
  chatbot?: Chatbot | null;
}

export function ChatbotForm({ isOpen, onClose, onSubmit, chatbot }: ChatbotFormProps) {
  const { t } = useTranslation('chatbots');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateChatbotDto>({
    defaultValues: defaultChatbotValues,
  });

  useEffect(() => {
    if (chatbot) {
      reset({
        name: chatbot.name,
        description: chatbot.description,
        aiModel: chatbot.aiModel,
        systemPrompt: chatbot.systemPrompt,
      });
    } else {
      reset(defaultChatbotValues);
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
                      {chatbot ? t('form.editTitle') : t('form.createTitle')}
                    </Dialog.Title>

                    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                          {t('form.name')}
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            id="name"
                            {...register('name', { required: t('form.required') })}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.name && (
                            <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                          {t('form.description')}
                        </label>
                        <div className="mt-2">
                          <textarea
                            id="description"
                            rows={3}
                            {...register('description', { required: t('form.required') })}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.description && (
                            <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="aiModel" className="block text-sm font-medium leading-6 text-gray-900">
                          {t('form.model')}
                        </label>
                        <div className="mt-2">
                          <select
                            id="aiModel"
                            {...register('aiModel', { required: t('form.required') })}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          >
                            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                            <option value="gpt-4">GPT-4</option>
                            <option value="gpt-4-turbo">GPT-4 Turbo</option>
                          </select>
                          {errors.aiModel && (
                            <p className="mt-2 text-sm text-red-600">{errors.aiModel.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="systemPrompt" className="block text-sm font-medium leading-6 text-gray-900">
                          {t('form.systemPrompt')}
                        </label>
                        <div className="mt-2">
                          <textarea
                            id="systemPrompt"
                            rows={4}
                            {...register('systemPrompt', { required: t('form.required') })}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.systemPrompt && (
                            <p className="mt-2 text-sm text-red-600">{errors.systemPrompt.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:w-auto"
                        >
                          {isSubmitting ? t('form.submitting') : chatbot ? t('form.save') : t('form.create')}
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