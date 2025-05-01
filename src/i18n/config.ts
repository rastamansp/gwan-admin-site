import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import authPt from './locales/pt/auth.json';
import authEn from './locales/en/auth.json';
import dashboardPt from './locales/pt/dashboard.json';
import dashboardEn from './locales/en/dashboard.json';
import commonPt from './locales/pt/common.json';
import commonEn from './locales/en/common.json';
import knowledgePt from './locales/pt/knowledge.json';
import knowledgeEn from './locales/en/knowledge.json';

// Log das traduções carregadas
console.log('Knowledge PT:', knowledgePt);
console.log('Knowledge EN:', knowledgeEn);

const resources = {
  pt: {
    auth: authPt,
    dashboard: dashboardPt,
    common: commonPt,
    knowledge: knowledgePt
  },
  en: {
    auth: authEn,
    dashboard: dashboardEn,
    common: commonEn,
    knowledge: knowledgeEn
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt', // língua padrão
    fallbackLng: 'en',
    ns: ['auth', 'common', 'dashboard', 'knowledge'],
    defaultNS: 'knowledge',
    keySeparator: '.',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    },
    debug: true
  });

export default i18n; 