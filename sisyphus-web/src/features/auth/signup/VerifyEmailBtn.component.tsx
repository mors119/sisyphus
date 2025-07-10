import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { useTranslation } from 'react-i18next';

interface VerifyEmailBtnProps {
  onSendCode: () => void;
  verified: boolean;
  confirm: boolean;
}
export const VerifyEmailBtn = ({
  onSendCode,
  verified,
  confirm,
}: VerifyEmailBtnProps) => {
  const { t } = useTranslation();

  return (
    <DialogTrigger asChild>
      <Button
        variant="outline"
        type="button"
        className="w-full "
        onClick={onSendCode}
        disabled={verified || confirm}>
        {t(!verified && confirm ? 'signup.authCompleted' : 'signup.sendCode')}
      </Button>
    </DialogTrigger>
  );
};
