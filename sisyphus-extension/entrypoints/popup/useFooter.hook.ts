import { useTranslation } from 'react-i18next';
import { logoutApi } from './auth/auth.api';
import { useAuthStore } from './auth/auth.store';
import { useMessageStore } from './message.store';

export const useFooterHook = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { clear } = useAuthStore();
  const { setMsg } = useMessageStore();
  const { t } = useTranslation();

  const logoutHandler = async () => {
    try {
      await logoutApi();
      setMsg(t('footer.logout_suc'));
      clear();
    } catch (err) {
      setMsg(t('footer.logout_err'));
      console.log(err);
    }
  };

  return { accessToken, logoutHandler };
};
