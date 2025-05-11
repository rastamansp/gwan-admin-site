import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { SessionService } from '../../services/session.service';

interface UserMenuProps {
    userName: string;
}

const UserMenu: React.FC<UserMenuProps> = ({ userName }) => {
    const navigate = useNavigate();
    const sessionService = SessionService.getInstance();

    const handleLogout = () => {
        sessionService.clearSession();
        navigate('/auth/login');
    };

    const handleProfileClick = () => {
        const session = sessionService.getSession();
        if (session) {
            navigate(`/profile`);
        }
    };

    return (
        <Menu as="div" className="relative">
            <Menu.Button className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                <UserCircleIcon className="h-8 w-8" />
                <span>{userName}</span>
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
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={handleProfileClick}
                                    className={`${
                                        active ? 'bg-gray-100 dark:bg-gray-700' : ''
                                    } block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300`}
                                >
                                    Meu Perfil
                                </button>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={handleLogout}
                                    className={`${
                                        active ? 'bg-gray-100 dark:bg-gray-700' : ''
                                    } block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300`}
                                >
                                    Sair
                                </button>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

export default UserMenu; 