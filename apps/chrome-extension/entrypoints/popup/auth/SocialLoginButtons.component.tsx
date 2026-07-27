import { useTranslation } from 'react-i18next';
import { AUTH_TYPE } from './auth.constants';
import { useOAuthHook } from './oauth.hook';

export const SocialLoginButtons = () => {
  const { t } = useTranslation();
  const { handleLogin } = useOAuthHook();

  return (
    <div className="social-login-wrapper">
      <div className="social-login-buttons">
        {AUTH_TYPE.map((item) => (
          <button
            key={item.id}
            type="button"
            className="social-login-button"
            style={{ backgroundColor: item.bgColor }}
            aria-label={t(item.labelKey)}
            onClick={() => handleLogin(item.id)}>
            <item.icon size={item.size} />
            <span>{t(item.labelKey)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
