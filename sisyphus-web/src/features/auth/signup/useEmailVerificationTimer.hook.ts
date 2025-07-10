import { useEffect, useState } from 'react';

// 이메일 인증 시간 (5분)
export const useEmailVerificationTimer = (open: boolean) => {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (open) {
      setSecondsLeft(60 * 5);
      const interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [open]);

  return { secondsLeft };
};
