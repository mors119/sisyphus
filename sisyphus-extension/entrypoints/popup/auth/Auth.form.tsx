import { useTranslation } from 'react-i18next';
import { useAuthHook } from './useAuth.hook';

export const AuthFormField = () => {
  const { register, errors, handleSubmit, isSubmitting, submitError } =
    useAuthHook();
  const { t } = useTranslation();

  return (
    <form onSubmit={handleSubmit} className="form">
      {/* Email */}
      <div className="field">
        <label htmlFor="email">{t('main.auth.email')}</label>
        <input
          type="email"
          id="email"
          placeholder={t('main.auth.example')}
          {...register('email', { required: t('main.auth.required_email') })}
        />
        {errors.email && <p className="error">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div className="field">
        <label htmlFor="password">{t('main.auth.password')}</label>
        <input
          type="password"
          id="password"
          placeholder={t('main.auth.password_example')}
          {...register('password', { required: t('main.auth.required_pass') })}
        />
        {errors.password && <p className="error">{errors.password.message}</p>}
      </div>

      <button className="save-button" type="submit" disabled={isSubmitting}>
        {t(isSubmitting ? 'main.auth.ing_login' : 'main.auth.login')}
      </button>
      {submitError && <p className="error">{t('main.auth.error')}</p>}
    </form>
  );
};
