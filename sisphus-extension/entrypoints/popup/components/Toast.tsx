import { useEffect } from 'react';

export function Toast({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000); // 2초 후 자동 종료
    return () => clearTimeout(timer);
  }, [onClose]);

  return <div className="toast">{message}</div>;
}
