import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import am from './locales/am.json';
import om from './locales/om.json';

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    am: { translation: am },
    om: { translation: om },
  },
  lng: localStorage.getItem('i18nextLng') ?? 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

function syncDocumentLang(lng: string) {
  document.documentElement.lang = lng;
  localStorage.setItem('i18nextLng', lng);
}

syncDocumentLang(i18n.language);
i18n.on('languageChanged', syncDocumentLang);

export default i18n;
