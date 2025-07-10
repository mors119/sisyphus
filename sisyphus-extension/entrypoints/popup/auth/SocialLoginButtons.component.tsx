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
          <span
            key={item.id}
            role="button"
            className="social-login-button tooltip-wrapper"
            style={{ backgroundColor: item.bgColor }}
            onClick={() => handleLogin(item.id)}>
            <item.icon size={item.size} style={{ color: item.color }} />
            <span className="tooltip_top">{item.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
};
