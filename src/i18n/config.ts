import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import all translation files
import enAuth from './locales/en/auth.json';
import ptAuth from './locales/pt/auth.json';
import enCommon from './locales/en/common.json';
import ptCommon from './locales/pt/common.json';
import enDashboard from './locales/en/dashboard.json';
import ptDashboard from './locales/pt/dashboard.json';
import enKnowledge from './locales/en/knowledge.json';
import ptKnowledge from './locales/pt/knowledge.json';
import enChatbots from './locales/en/chatbots.json';
import ptChatbots from './locales/pt/chatbots.json';

// Initialize i18n only once
if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: {
          auth: enAuth,
          common: enCommon,
          dashboard: enDashboard,
          knowledge: enKnowledge,
          chatbots: enChatbots
        },
        pt: {
          auth: ptAuth,
          common: ptCommon,
          dashboard: ptDashboard,
          knowledge: ptKnowledge,
          chatbots: ptChatbots
        }
      },
      lng: 'pt',
      fallbackLng: 'pt',
      ns: ['auth', 'common', 'dashboard', 'knowledge', 'chatbots'],
      defaultNS: 'common',
      debug: false,
      interpolation: {
        escapeValue: false
      },
      react: {
        useSuspense: false
      }
    });
}

export default i18n; 