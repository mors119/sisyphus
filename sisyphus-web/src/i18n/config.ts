import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../locales/en/translation.json';
import ko from '../locales/ko/translation.json';

i18n
  .use(initReactI18next) // React에 연결
  .init({
    resources: {
      en: { translation: en },
      ko: { translation: ko },
    },
    lng: 'en', // 초기 언어
    fallbackLng: 'ko', // 없는 경우 대체
    interpolation: {
      escapeValue: false, // React에선 XSS 방지 불필요
    },
  });

export default i18n;
