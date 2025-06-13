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

import { useAlert } from '@/hooks/use-alert';
import { useEffect, useState } from 'react';
import { verifyEmailCode } from '@/services/auth/route';
import { formatTime } from '@/utils/format-time';

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
        alertMessage('✅ 인증 성공!');
      } else {
        alertMessage('❌ 인증 실패');
      }
    } catch (err) {
      console.error(err);
      alertMessage('❗ 인증 요청 중 오류 발생');
    } finally {
      setIsLoading(false);
      setCode('');
    }
  };

  return (
    <DialogContent style={{ opacity: '1' }}>
      <DialogHeader>
        <DialogTitle>코드 인증</DialogTitle>
        <DialogDescription>
          {emailValue} 으로 인증 코드가 전송되었습니다.
          <br />
          6자리 코드를 입력하세요.
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
          <span>남은 인증 시간: {formatTime(secondsLeft)}</span>
        </div>
      </DialogFooter>
    </DialogContent>
  );
};
