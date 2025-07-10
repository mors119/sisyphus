import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAlert } from '@/hooks/useAlert';
import { useEffect, useState } from 'react';
import { formatTime } from '@/utils/formatTime.util';
import { verifyEmailCode } from '../auth.api';
import { useTranslation } from 'react-i18next';

interface VerifyEmailProps {
  emailValue: string;
  secondsLeft: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  setConfirm: (confirm: boolean) => void;
}

export const VerifyEmail = ({
  emailValue,
  secondsLeft,
  open,
  setOpen,
  setConfirm,
}: VerifyEmailProps) => {
  const { alertMessage } = useAlert();
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 모달 열릴 때마다 초기화
  useEffect(() => {
    if (open) {
      setCode('');
    }
  }, [open]);

  // 코드가 6자리 되면 자동 제출
  useEffect(() => {
    if (code.length === 6) {
      handleSubmit();
    }
  }, [code]);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const isValid = await verifyEmailCode(emailValue, code);
      if (isValid) {
        setOpen(false);
        setConfirm(true);
        alertMessage(t('auth.success'));
      } else {
        alertMessage(t('auth.false'));
      }
    } catch (err) {
      console.error(err);
      alertMessage(t('auth.error'));
    } finally {
      setIsLoading(false);
      setCode('');
    }
  };

  return (
    <DialogContent style={{ opacity: '1' }}>
      <DialogHeader>
        <DialogTitle>{t('signup.code.title')}</DialogTitle>
        <DialogDescription>
          {t('signup.code.to', { target: emailValue })}
          <br />
          {t('signup.code.placeholder')}
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col items-center gap-2 justify-center">
        <InputOTP
          maxLength={6}
          value={code}
          onChange={(val) => setCode(val)}
          disabled={isLoading}>
          <InputOTPGroup>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <InputOTPSlot key={index} index={index} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>
      <DialogFooter>
        <div className="flex text-xs gap-2">
          {/* TODO: 남은 인증 횟수 */}
          <span>
            {t('signup.code.timer', { time: formatTime(secondsLeft) })}
          </span>
        </div>
      </DialogFooter>
    </DialogContent>
  );
};
