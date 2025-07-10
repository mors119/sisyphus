import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CloseBtn } from '@/components/custom/Btn';
import ReactMarkdown from 'react-markdown';

interface AgreeFormProps {
  setShow: (show: string) => void;
  show: string;
  className?: string;
  onClose?: () => void;
  setIsLoading?: (isLoading: boolean) => void;
}

// show === '1' → 이용약관 (terms.md)
// show === '2' → 개인정보 수집 및 이용 동의서 (policy.md)

export const AgreeForm = ({
  setShow,
  show,
  className,
  onClose,
  setIsLoading,
}: AgreeFormProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = show === '1' || show === '2';
  const { i18n } = useTranslation();
  const [markdown, setMarkdown] = useState('');

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClose?.();
        setIsLoading?.(false);
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose, setIsLoading]);

  // 마크다운 로딩
  useEffect(() => {
    if (show === '1' || show === '2') {
      const fileName = show === '1' ? 'terms.md' : 'policy.md';
      fetch(`/locales/${i18n.language}/${fileName}`)
        .then((res) => res.text())
        .then(setMarkdown)
        .catch(() => setMarkdown(''));
    }
  }, [show, i18n.language]);

  return (
    <div
      id="agree-form"
      ref={containerRef}
      className={cn(
        'absolute dark:bg-neutral-900 left-0 top-0 z-50 bg-white border rounded-md shadow text-sm transition-all duration-500 ease-in-out',
        isVisible
          ? 'max-h-[380px] opacity-100 p-4'
          : 'max-h-0 opacity-0 p-0 pointer-events-none',
        className,
      )}
      style={{ overflow: 'hidden' }}>
      <div className="overflow-y-auto max-h-[340px]">
        {isVisible && (
          <CloseBtn
            size={22}
            className="absolute right-2 top-2"
            onClick={() => {
              setShow('0');
              setIsLoading?.(false);
            }}
          />
        )}
        {markdown && <ReactMarkdown>{markdown}</ReactMarkdown>}
      </div>
    </div>
  );
};
