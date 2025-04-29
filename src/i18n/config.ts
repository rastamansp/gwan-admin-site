import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import authPt from './locales/pt/auth.json';
import authEn from './locales/en/auth.json';
import dashboardPt from './locales/pt/dashboard.json';
import dashboardEn from './locales/en/dashboard.json';
import commonPt from './locales/pt/common.json';
import commonEn from './locales/en/common.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      pt: {
        auth: authPt,
        dashboard: dashboardPt,
        common: commonPt
      },
      en: {
        auth: authEn,
        dashboard: dashboardEn,
        common: commonEn
      }
    },
    lng: 'pt',
    fallbackLng: 'en',
    ns: ['auth', 'common', 'dashboard'],
    defaultNS: 'auth',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    },
    debug: true
  });

i18n.loadNamespaces(['auth', 'common', 'dashboard']).then(() => {
  console.log('i18n namespaces loaded');
});

export default i18n; 