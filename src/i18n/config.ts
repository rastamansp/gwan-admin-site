import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import authPt from './locales/pt/auth.json';
import authEn from './locales/en/auth.json';
import dashboardPt from './locales/pt/dashboard.json';
import dashboardEn from './locales/en/dashboard.json';
import commonPt from './locales/pt/common.json';
import commonEn from './locales/en/common.json';

const resources = {
  en: {
    common: commonEn,
    auth: authEn,
    dashboard: dashboardEn,
  },
  pt: {
    common: commonPt,
    auth: authPt,
    dashboard: dashboardPt,
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
    ns: ['common', 'auth', 'dashboard'],
    defaultNS: 'common',
    debug: true,
  });

export default i18n; 