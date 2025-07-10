import { Puzzle, Smartphone, Sprout } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const FeatureHighlight = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Puzzle className="w-8 h-8 text-point-yellow" />,
      title: t('home.feature.title1'),
      subtitle: t('home.feature.subtitle1'),
      description: t('home.feature.desc1'),
    },
    {
      icon: <Smartphone className="w-8 h-8 text-point-yellow" />,
      title: t('home.feature.title2'),
      subtitle: t('home.feature.subtitle2'),
      description: t('home.feature.desc2'),
    },
    {
      icon: <Sprout className="w-8 h-8 text-point-yellow" />,
      title: t('home.feature.title3'),
      subtitle: t('home.feature.subtitle3'),
      description: t('home.feature.desc3'),
    },
  ];

  return (
    <section className="w-full py-6 px-2 lg:px-4 flex justify-center bg-black">
      <div className="border-2 border-point-yellow p-1 rounded-xl bg-white dark:bg-neutral-900 max-w-[1286px]">
        <div className="border-2 p-4 border-point-blue rounded-xl max-w-[1280px]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-neutral-50 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-point-blue mb-1">
                  {feature.title}
                </h3>
                <h4 className="text-lg font-semibold text-point-yellow mb-2">
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
    </section>
  );
};
