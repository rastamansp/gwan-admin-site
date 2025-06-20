import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  HomeIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  BookOpenIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChatBubbleLeftRightIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import KnowledgeBaseSidebar from '../../modules/knowledge/components/KnowledgeBaseSidebar';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const navigation = [
  { name: 'dashboard', href: '/', icon: HomeIcon },
  { name: 'users', href: '/users', icon: UserGroupIcon },
  { name: 'knowledge', href: '/knowledge', icon: BookOpenIcon, hasSubmenu: true },
  { name: 'chatbots', href: '/chatbots', icon: ChatBubbleLeftRightIcon },
  { name: 'crawling', href: '/crawling', icon: GlobeAltIcon },
  { name: 'settings', href: '/settings', icon: Cog6ToothIcon },
];

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const { t } = useTranslation('common');
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['knowledge']);

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const toggleExpand = (name: string) => {
    setExpandedItems(prev => 
      prev.includes(name) 
        ? prev.filter(item => item !== name)
        : [...prev, name]
    );
  };

  const renderNavigation = () => (
    <ul role="list" className="-mx-2 space-y-1">
      {navigation.map((item) => (
        <li key={item.name}>
          {item.hasSubmenu ? (
            <div>
              <div className="flex items-center">
                <Link
                  to={item.href}
                  className={`
                    flex-1 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                    ${isActive(item.href)
                      ? 'bg-gray-50 text-primary-600 dark:bg-gray-700 dark:text-primary-400'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-primary-400'
                    }
                  `}
                >
                  <item.icon
                    className="h-6 w-6 shrink-0"
                    aria-hidden="true"
                  />
                  {t(item.name)}
                </Link>
                <button
                  onClick={() => toggleExpand(item.name)}
                  className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
                >
                  {expandedItems.includes(item.name) ? (
                    <ChevronUpIcon className="h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
              {expandedItems.includes(item.name) && (
                <div className="ml-4 mt-1">
                  <KnowledgeBaseSidebar />
                </div>
              )}
            </div>
          ) : (
            <Link
              to={item.href}
              className={`
                group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                ${isActive(item.href)
                  ? 'bg-gray-50 text-primary-600 dark:bg-gray-700 dark:text-primary-400'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-primary-400'
                }
              `}
            >
              <item.icon
                className="h-6 w-6 shrink-0"
                aria-hidden="true"
              />
              {t(item.name)}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-800 px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center">
                    <img
                      className="h-8 w-auto"
                      src="/logo.svg"
                      alt="Gwan Admin"
                    />
                  </div>
                  <nav className="flex flex-1 flex-col">
                    {renderNavigation()}
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <img
              className="h-8 w-auto"
              src="/logo.svg"
              alt="Gwan Admin"
            />
          </div>
          <nav className="flex flex-1 flex-col">
            {renderNavigation()}
          </nav>
        </div>
      </div>
    </>
  );
} 