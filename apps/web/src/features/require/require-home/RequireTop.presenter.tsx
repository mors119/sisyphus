import { Button } from '@/components/ui/button';
import React from 'react';
import { useTranslation } from 'react-i18next';
// Optional: tiny motion on hover without breaking if framer-motion is not installed
// If you have framer-motion, uncomment the next line and replace <div> wrappers with <motion.button>
// import { motion } from 'framer-motion'

/**
 * RequestCard
 * 역할(Role): 제품 피드백 허브. 버그 신고, 기능 요청, 내 요청 목록, 기타 문의 링크를 한 곳에서 제공.
 * 타입(Type): React Function Component (TSX)
 * 의존성(Dependencies): TailwindCSS (권장). 외부 컴포넌트 없이 동작.
 * 접근성(Accessibility): 버튼에 aria-label 제공, heading 구조 적용.
 */
interface RequestCardProps {
  onReportBug: () => void;
  onRequestFeature: () => void;
  onViewMyRequests: () => void;
  otherLinkHref: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  note?: React.ReactNode;
}

export default function RequireTop({
  onReportBug,
  onRequestFeature,
  onViewMyRequests,
}: RequestCardProps) {
  const { t } = useTranslation();

  return (
    <>
      {/* Header */}
      <div className="flex flex-col gap-2 mb-4 md:gap-3 md:mb-6 lg:gap-4 lg:mb-8">
        <h2
          id="request-card-title"
          className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          {t('require.home.tit')}
        </h2>
        <p className="text-center mt-2 text-sm md:text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
          <span className="font-bold"> {t('require.home.span')}</span>
          {t('require.home.sub')}
          <br />
          {t('require.home.sub2')}
        </p>

        <p className="mt-1 text-center text-xs md:text-sm text-zinc-500 dark:text-zinc-400">
          {t('require.home.text')}
        </p>
      </div>

      <div className="flex gap-3 justify-center flex-wrap md:gap-4">
        {/* 버그 신고 */}
        <Button
          type="button"
          className="hover:bg-rose-600 md:text-sm text-xs"
          aria-label={t('require.home.bug')}
          onClick={onReportBug}>
          <span className="mr-2 inline-block text h-2 w-2 rounded-full bg-white/80 group-hover:scale-110 transition-transform" />
          {t('require.home.bug')}
        </Button>

        {/* 기능 요청 */}
        <Button
          type="button"
          className="md:text-sm text-xs hover:bg-green-500"
          aria-label={t('require.home.req')}
          onClick={onRequestFeature}>
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-white/80 group-hover:scale-110 transition-transform" />
          {t('require.home.req')}
        </Button>

        {/* 내 요청 사항 */}
        <Button
          variant="outline"
          type="button"
          className="md:text-sm text-xs"
          aria-label={t('require.home.my')}
          onClick={onViewMyRequests}>
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-brand-primary" />
          {t('require.home.my')}
        </Button>
      </div>

      {/* 도움 문구 */}
      <div className="my-5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 p-4 text-xs md:text-sm text-zinc-600 dark:text-zinc-300">
        <p className="leading-relaxed text-center">{t('require.home.ex')}</p>
      </div>

      {/* 다른 요청 사항 */}
      {/* <div className="flex items-center justify-end px-4">
        <Button
          onClick
          className="rounded text-sm font-medium underline-offset-4 decoration-1 hover:text-info hover:underline focus:outline-none focus:ring-2 focus:ring-focus-ring md:text-base">
          이외의 요청사항 
        </Button>
      </div> */}
    </>
  );
}
