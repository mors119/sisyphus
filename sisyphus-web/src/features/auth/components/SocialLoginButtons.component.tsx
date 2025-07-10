import { Separator } from '@/components/ui/separator';
import { AUTH_TYPE } from '../auth.constants';
import { SocialLoginButton } from './SocialLoginButton.component';
import { useTranslation } from 'react-i18next';

export const SocialLoginButtons = () => {
  const { t } = useTranslation();
  return (
    <>
      <Separator className="my-4 relative flex justify-center">
        <span className="absolute -top-1.5  text-xs bg-white px-2 text-neutral-400 dark:bg-neutral-900">
          {t('signin.socialLogin')}
        </span>
      </Separator>
      <div className="flex gap-3 justify-center">
        {AUTH_TYPE.map((item) => (
          <SocialLoginButton key={item.id} item={item} />
        ))}
      </div>
    </>
  );
};
