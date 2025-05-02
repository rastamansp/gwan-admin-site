import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  BellIcon,
  UserCircleIcon,
  Bars3Icon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';
import { removeAuthToken } from '../../utils/auth';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function Header({ setSidebarOpen, theme, toggleTheme }: HeaderProps) {
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  const handleLogout = () => {
    removeAuthToken();
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <div className="sticky top-0 z-40 bg-white dark:bg-gray-800">
      <div className="flex h-16 items-center gap-x-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-200 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">{t('openSidebar')}</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>

        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div className="flex flex-1" />
          
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            {/* Theme toggle */}
            <button
              type="button"
              className="rounded-full p-1 text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
              onClick={toggleTheme}
            >
              <span className="sr-only">{t('toggleTheme')}</span>
              {theme === 'dark' ? (
                <SunIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <MoonIcon className="h-6 w-6" aria-hidden="true" />
              )}
            </button>

            {/* Notifications */}
            <button
              type="button"
              className="rounded-full p-1 text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
            >
              <span className="sr-only">{t('notifications')}</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Separator */}
            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:lg:bg-gray-700" aria-hidden="true" />

            {/* Profile dropdown */}
            <Menu as="div" className="relative">
              <Menu.Button className="-m-1.5 flex items-center p-1.5">
                <span className="sr-only">{t('openUserMenu')}</span>
                <UserCircleIcon
                  className="h-8 w-8 text-gray-400 dark:text-gray-300"
                  aria-hidden="true"
                />
                <span className="hidden lg:flex lg:items-center">
                  <span className="ml-4 text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100" aria-hidden="true">
                    Admin
                  </span>
                </span>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white dark:bg-gray-800 py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleProfileClick}
                        className={`
                          block w-full text-left px-3 py-1 text-sm leading-6
                          ${active ? 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}
                        `}
                      >
                        {t('profile')}
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`
                          block w-full text-left px-3 py-1 text-sm leading-6
                          ${active ? 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}
                        `}
                      >
                        {t('logout')}
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
} 