import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import 'dayjs/locale/en';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

dayjs.extend(relativeTime);

export const useDayjs = () => {
  const { i18n } = useTranslation();

  return useMemo(() => {
    const withLocale = <T extends dayjs.Dayjs>(d: T) => d.locale(i18n.language);

    return {
      formatRelativeDate: (date?: string | number | Date) => {
        if (!date) return '';

        const parsed = dayjs(date);
        if (!parsed.isValid()) return '';

        return withLocale(parsed).fromNow();
      },

      formatDate: (
        date?: string | number | Date,
        format = 'YYYY-MM-DD HH:mm',
      ) => {
        if (!date) return '';

        const parsed = dayjs(date);
        if (!parsed.isValid()) return '';

        return withLocale(parsed).format(format);
      },
    };
  }, [i18n.language]);
};
