import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import AuthService from '../services/auth.service';

interface UserProfile {
    id: string;
    name: string;
    email: string;
    whatsapp?: string;
    createdAt: string;
    updatedAt: string;
}

const MyProfile: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        whatsapp: ''
    });
    const [saveLoading, setSaveLoading] = useState(false);
    const authService = AuthService.getInstance();

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const userData = await authService.getUserProfile();
            setProfile(userData);
            setFormData({
                name: userData.name,
                whatsapp: userData.whatsapp || ''
            });
        } catch (err) {
            console.error('Error loading profile:', err);
            setError('Erro ao carregar perfil');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaveLoading(true);
            await authService.updateUserProfile(formData);
            await loadProfile();
            setIsEditing(false);
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Erro ao atualizar perfil');
        } finally {
            setSaveLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center space-x-4 mb-6">
                            <UserCircleIcon className="h-16 w-16 text-gray-400" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Meu Perfil
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Gerencie suas informações pessoais
                                </p>
                            </div>
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Nome
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                                        bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white 
                                        focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={profile?.email}
                                        disabled
                                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                                        bg-gray-100 dark:bg-gray-600 px-3 py-2 text-gray-500 dark:text-gray-400"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        WhatsApp
                                    </label>
                                    <input
                                        type="tel"
                                        name="whatsapp"
                                        id="whatsapp"
                                        value={formData.whatsapp}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                                        bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white 
                                        focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                    />
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setFormData({
                                                name: profile?.name || '',
                                                whatsapp: profile?.whatsapp || ''
                                            });
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                                        bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                                        rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saveLoading}
                                        className="px-4 py-2 text-sm font-medium text-white bg-primary-600 
                                        border border-transparent rounded-md hover:bg-primary-700 
                                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 
                                        disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {saveLoading ? 'Salvando...' : 'Salvar'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Nome</h3>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{profile?.name}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{profile?.email}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">WhatsApp</h3>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {profile?.whatsapp || 'Não informado'}
                                    </p>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 text-sm font-medium text-white bg-primary-600 
                                        border border-transparent rounded-md hover:bg-primary-700 
                                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                    >
                                        Editar Perfil
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile; 