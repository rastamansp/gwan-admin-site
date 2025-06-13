import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import type { Chatbot } from '../types/chatbot';
import { ChatbotStatusBadge } from './ChatbotStatusBadge';

interface ChatbotTableProps {
  chatbots: Chatbot[];
  isLoading: boolean;
  onEdit: (chatbot: Chatbot) => void;
  onStatusChange: (id: string, status: 'active' | 'inactive') => void;
}

export function ChatbotTable({ chatbots, isLoading, onEdit, onStatusChange }: ChatbotTableProps) {
  const { t } = useTranslation('chatbots');

  if (isLoading) {
    return (
      <div className="mt-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (chatbots.length === 0) {
    return (
      <div className="mt-8 text-center">
        <h3 className="mt-2 text-sm font-semibold text-gray-900">{t('empty.title')}</h3>
        <p className="mt-1 text-sm text-gray-500">{t('empty.description')}</p>
      </div>
    );
  }

  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                  {t('table.name')}
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  {t('table.description')}
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  {t('table.status')}
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  {t('table.model')}
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                  <span className="sr-only">{t('table.actions')}</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {chatbots.map((chatbot) => (
                <tr key={chatbot.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                    {chatbot.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {chatbot.description}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <ChatbotStatusBadge status={chatbot.status} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {chatbot.aiModel}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <Menu as="div" className="relative inline-block text-left">
                      <div>
                        <Menu.Button className="inline-flex items-center rounded-full bg-white p-1.5 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                          <span className="sr-only">{t('table.openMenu')}</span>
                          <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
                        </Menu.Button>
                      </div>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => onEdit(chatbot)}
                                  className={`${
                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                  } block w-full px-4 py-2 text-left text-sm`}
                                >
                                  {t('actions.edit')}
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => onStatusChange(chatbot.id, chatbot.status === 'active' ? 'inactive' : 'active')}
                                  className={`${
                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                  } block w-full px-4 py-2 text-left text-sm`}
                                >
                                  {chatbot.status === 'active' ? t('actions.deactivate') : t('actions.activate')}
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 