import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  BellIcon,
  UserCircleIcon,
  SunIcon,
  MoonIcon,
  LanguageIcon,
} from '@heroicons/react/24/outline';

export default function Header() {
  const { t, i18n } = useTranslation('common');
  const navigate = useNavigate();

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'pt' ? 'en' : 'pt';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const handleLogout = () => {
    // Remove o token
    localStorage.removeItem('token');
    // Redireciona para a página de login
    navigate('/auth/login');
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1" />
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Theme toggle */}
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            onClick={toggleTheme}
          >
            <span className="sr-only">{t('toggleTheme')}</span>
            {document.documentElement.classList.contains('dark') ? (
              <SunIcon className="h-6 w-6" aria-hidden="true" />
            ) : (
              <MoonIcon className="h-6 w-6" aria-hidden="true" />
            )}
          </button>

          {/* Language toggle */}
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            onClick={toggleLanguage}
          >
            <span className="sr-only">{t('toggleLanguage')}</span>
            <LanguageIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Notifications */}
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <span className="sr-only">{t('notifications')}</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Profile dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="-m-1.5 flex items-center p-1.5">
              <span className="sr-only">{t('openUserMenu')}</span>
              <UserCircleIcon
                className="h-8 w-8 text-gray-400"
                aria-hidden="true"
              />
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
                    <a
                      href="#"
                      className={`
                        block px-3 py-1 text-sm leading-6
                        ${
                          active
                            ? 'bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
                            : 'text-gray-700 dark:text-gray-300'
                        }
                      `}
                    >
                      {t('profile')}
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`
                        block w-full text-left px-3 py-1 text-sm leading-6
                        ${
                          active
                            ? 'bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
                            : 'text-gray-700 dark:text-gray-300'
                        }
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
    </header>
  );
} 