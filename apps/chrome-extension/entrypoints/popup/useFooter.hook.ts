import { useTranslation } from 'react-i18next';
import { useAuthStore } from './auth/auth.store';
import { useMessageStore } from './message.store';

export const useFooterHook = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { clear } = useAuthStore();
  const { setMsg } = useMessageStore();
  const { t } = useTranslation();

  const logoutHandler = () => {
    clear();
    setMsg(t('footer.logout_suc'));
  };

  return { accessToken, logoutHandler };
};
