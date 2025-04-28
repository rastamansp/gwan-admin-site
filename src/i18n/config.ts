import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

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
      auth: {
        login: 'Login',
        register: 'Register',
        email: 'Email',
        password: 'Password',
        forgotPassword: 'Forgot Password?',
        rememberMe: 'Remember Me',
      },
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
      auth: {
        login: 'Entrar',
        register: 'Registrar',
        email: 'E-mail',
        password: 'Senha',
        forgotPassword: 'Esqueceu a senha?',
        rememberMe: 'Lembrar-me',
      },
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