import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import authPt from './locales/pt/auth.json';
import authEn from './locales/en/auth.json';
import dashboardPt from './locales/pt/dashboard.json';
import dashboardEn from './locales/en/dashboard.json';

const resources = {
  en: {
    translation: {
      common: {
        dashboard: 'Dashboard',
        users: 'Users',
        settings: 'Settings',
        profile: 'Profile',
        notifications: 'Notifications',
        logout: 'Logout',
        language: 'Language',
        theme: 'Theme',
        dark: 'Dark',
        light: 'Light',
      },
      auth: authEn,
      dashboard: dashboardEn,
    },
  },
  pt: {
    translation: {
      common: {
        dashboard: 'Painel',
        users: 'Usuários',
        settings: 'Configurações',
        profile: 'Perfil',
        notifications: 'Notificações',
        logout: 'Sair',
        language: 'Idioma',
        theme: 'Tema',
        dark: 'Escuro',
        light: 'Claro',
      },
      auth: authPt,
      dashboard: dashboardPt,
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 