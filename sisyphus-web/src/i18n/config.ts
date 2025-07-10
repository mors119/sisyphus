import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en/translation.json';
import ko from './locales/ko/translation.json';

i18n
  .use(LanguageDetector) // ✅ 브라우저 언어 감지기 추가
  .use(initReactI18next)
  .init({
    fallbackLng: 'en', // 감지 실패 시 기본 언어
    supportedLngs: ['en', 'ko'],
    resources: {
      en: { translation: en },
      ko: { translation: ko },
    },
    detection: {
      order: ['localStorage', 'navigator'], // 감지 우선순위
      caches: ['localStorage'], // 이후에도 기억함
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
