import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { getHomeBannerTextItems } from './BannerTextItems.presenter';
import { useTranslation } from 'react-i18next';

export const HomeBanner = () => {
  const [visible, setVisible] = useState(false);

  const { t } = useTranslation();
  const textItems = useMemo(() => getHomeBannerTextItems(t), [t]);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 100); // mount 이후 약간의 delay
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className="w-full">
      <div className="relative w-full px-6 py-12 md:py-16 text-center overflow-hidden bg-white dark:bg-black">
        {/* 어두운 반투명 오버레이 */}
        <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm" />

        {/* 콘텐츠 */}
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

          {/* 버튼 */}
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-point-blue hover:bg-point-blue/90 text-white font-bold text-lg px-8 py-6 group">
              {t('home.banner.download')}
              <ChevronRight className="w-5 h-5 translate-x-[-4px] transform transition-transform duration-500 group-hover:translate-x-1 group-hover:scale-110" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-point-yellow border-point-yellow bg-black hover:bg-neutral-300 dark:border-[#ffcd49] hover:border-neutral-300 hover:text-black dark:hover:bg-neutral-300 dark:hover:border-neutral-300 font-bold text-lg px-8 py-6 duration-300">
              {t('home.banner.howToUse')}
            </Button>
          </div>

          <p className="text-xs text-neutral-300">{t('home.banner.desc')}</p>
        </div>
      </div>
    </section>
  );
};
