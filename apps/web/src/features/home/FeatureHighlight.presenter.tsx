import { Puzzle, Smartphone, Sprout } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const FeatureHighlight = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Puzzle className="h-8 w-8 text-on-brand-accent" />,
      title: t('home.feature.title1'),
      subtitle: t('home.feature.subtitle1'),
      description: t('home.feature.desc1'),
    },
    {
      icon: <Smartphone className="h-8 w-8 text-on-brand-accent" />,
      title: t('home.feature.title2'),
      subtitle: t('home.feature.subtitle2'),
      description: t('home.feature.desc2'),
    },
    {
      icon: <Sprout className="h-8 w-8 text-on-brand-accent" />,
      title: t('home.feature.title3'),
      subtitle: t('home.feature.subtitle3'),
      description: t('home.feature.desc3'),
    },
  ];

  return (
    <div className="w-full md:py-6 px-2 lg:px-4 flex justify-center bg-black">
      <div className="brand-frame max-w-[1286px]">
        <div className="brand-frame-inner max-w-[1280px] py-2 md:p-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-card border bg-neutral-50 p-6">
                <div className="mb-4 flex w-fit items-center rounded-control bg-brand-accent-subtle p-2">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-sis mb-1">
                  {feature.title}
                </h3>
                <h4 className="mb-2 text-lg font-semibold text-text-secondary">
                  {feature.subtitle}
                </h4>
                <p className="text-neutral-700 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
