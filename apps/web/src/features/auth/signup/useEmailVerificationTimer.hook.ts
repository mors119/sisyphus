import { useCallback, useEffect, useState } from 'react';

// 이메일 인증 시간 (5분)
export const useEmailVerificationTimer = (open: boolean) => {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!open) return;

    const interval = setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          clearInterval(interval);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open]);

  const startTimer = useCallback(() => {
    setSecondsLeft(60 * 5);
  }, []);

  return { secondsLeft, startTimer };
};
