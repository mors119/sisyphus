import { TFunction } from 'i18next';

export const getHomeBannerTextItems = (t: TFunction) => [
  <img
    key="logo"
    className="w-16 h-16 text-point-yellow"
    src="/logo/diagram-logo.png"
    alt="Sisyphus Logo"
  />,
  <h1
    key="title"
    className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-md">
    <span className="text-point-blue">Sisyphus</span>
    <span className="text-point-yellow">-Academy</span>
  </h1>,
  <p key="desc" className="text-lg md:text-xl font-medium max-w-2xl mx-auto">
    {t('home.banner.p1')}
    <br />
    <span className="font-semibold text-point-blue text-xl md:text-2xl">
      {t('home.banner.p2')}
    </span>
  </p>,
  <p
    key="quote"
    className="text-xl md:text-2xl font-bold text-point-yellow mb-8 italic drop-shadow">
    {t('home.banner.p3')}
  </p>,
];
