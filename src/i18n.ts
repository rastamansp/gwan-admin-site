import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            pt: {
                common: {
                    // Menu items
                    'dashboard': 'Dashboard',
                    'users': 'Usuários',
                    'settings': 'Configurações',
                    'knowledge': 'Bases de Conhecimento',

                    // Header
                    'toggleTheme': 'Alternar tema',
                    'toggleLanguage': 'Alternar idioma',
                    'notifications': 'Notificações',
                    'openUserMenu': 'Abrir menu do usuário',
                    'profile': 'Perfil',
                    'logout': 'Sair'
                },
                translation: {
                    // Knowledge Base
                    'knowledge.title': 'Bases de Conhecimento',
                    'knowledge.name': 'Nome',
                    'knowledge.description': 'Descrição',
                    'knowledge.status': 'Status',
                    'knowledge.createdAt': 'Criado em',
                    'knowledge.actions': 'Ações',
                    'knowledge.delete': 'Excluir',
                    'knowledge.deleteConfirm': 'Tem certeza que deseja excluir esta base de conhecimento?',
                    'knowledge.noBases': 'Nenhuma base de conhecimento encontrada',
                    'knowledge.status.completed': 'Concluído',
                    'knowledge.status.processing': 'Processando',
                    'knowledge.status.failed': 'Falhou',
                    'knowledge.error.load': 'Erro ao carregar bases de conhecimento',
                    'knowledge.error.delete': 'Erro ao excluir base de conhecimento'
                }
            }
        },
        lng: 'pt',
        fallbackLng: 'pt',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n; 