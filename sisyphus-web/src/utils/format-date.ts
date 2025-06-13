import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko'; // 한글 출력

dayjs.extend(relativeTime);
dayjs.locale('en');

export const formatDate = (
  date: string | Date | undefined,
  format = 'YYYY-MM-DD HH:mm',
) => {
  return dayjs(date).format(format);
};

export const formatRelativeDate = (date: string | Date | undefined): string => {
  if (!date) return '';
  return dayjs(date).fromNow(); // ex: 2시간 전, 2일 전, 2달 전, 2년 전
};
