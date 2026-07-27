import { useEffect, useMemo, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { getHomeBannerTextItems } from './BannerTextItems.presenter';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/app/router/paths.constants';
import { useAuthStore } from '../auth/auth.store';
import { fetchDummyApi } from './dummy.api';

// shadcn/ui AlertDialog (Radix)
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

export const HomeBanner = () => {
  const [visible, setVisible] = useState(false);
  const [openDummyDialog, setOpenDummyDialog] = useState(false);
  const [isDummyLoading, setIsDummyLoading] = useState(false);

  const navigate = useNavigate();
  const { t } = useTranslation();
  const textItems = useMemo(() => getHomeBannerTextItems(t), [t]);
  const { user } = useAuthStore();

  const extensionUrl = import.meta.env.VITE_EXTENSION_URL ?? '';

  const openExternalNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  const runDummyAndNavigate = useCallback(async () => {
    setIsDummyLoading(true);
    try {
      await fetchDummyApi();
      navigate(PATHS.VIEW);
    } catch (error) {
      console.error('Dummy API 호출 실패:', error);
      toast.error(t('dummy.error'));
      setIsDummyLoading(false);

      return;
    } finally {
      setIsDummyLoading(false);
      setOpenDummyDialog(false);
    }
  }, [navigate]);

  const handleClick = () => {
    if (!user) {
      navigate(PATHS.AUTH_SIGN_IN);
      return;
    }

    //  로그인 상태면 먼저 모달로 확인
    setOpenDummyDialog(true);
  };

  return (
    <div className="w-full">
      <div className="relative w-full px-6 py-12 md:pb-10 md:pt-4 text-center overflow-hidden bg-white dark:bg-black">
        <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm" />

        <div className="relative z-10 flex flex-col items-center gap-4 text-white">
          {visible &&
            textItems.map((item, index) => (
              <div
                key={index}
                className="opacity-0 translate-y-5 animate-fade-up"
                style={{ animationDelay: `${index * 200}ms` }}>
                {item}
              </div>
            ))}

          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              onClick={() => {
                if (!extensionUrl) {
                  toast.info(t('home.banner.notAvailable'));
                  return;
                }
                openExternalNewTab(extensionUrl);
              }}
              className="group bg-action-primary px-8 py-6 text-lg font-bold text-on-brand-primary hover:bg-action-primary-hover">
              {t('home.banner.download')}
              <ChevronRight className="h-5 w-5 -translate-x-1 transform transition-transform duration-[var(--motion-standard)] group-hover:translate-x-1 group-hover:scale-110" />
            </Button>

            <Button
              size="lg"
              onClick={handleClick}
              variant="outline"
              className="border-brand-primary bg-black px-8 py-6 text-lg font-bold text-info duration-[var(--motion-standard)] hover:-translate-y-0.5 hover:border-neutral-300 hover:bg-neutral-300 hover:text-black dark:bg-accent-foreground dark:hover:border-brand-accent dark:hover:bg-brand-accent">
              {t('home.banner.howToUse')}
            </Button>
          </div>

          <p className="text-xs text-neutral-300">{t('home.banner.desc')}</p>
        </div>
      </div>

      {/* 더미 생성 확인 모달 */}
      <AlertDialog open={openDummyDialog} onOpenChange={setOpenDummyDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('dummy.confirm.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('dummy.confirm.desc')}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDummyLoading}
              onClick={() => {
                // “추가 안 함” → 바로 이동
                setOpenDummyDialog(false);
                navigate(PATHS.VIEW);
              }}>
              {t('dummy.confirm.skip')}
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={isDummyLoading}
              onClick={(e) => {
                e.preventDefault();
                void runDummyAndNavigate();
              }}>
              {isDummyLoading
                ? t('dummy.confirm.loading')
                : t('dummy.confirm.ok')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
