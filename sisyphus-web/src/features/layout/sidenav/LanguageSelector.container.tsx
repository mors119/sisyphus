import { CustomTooltip } from '@/components/custom/customTooltip';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Globe } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageSelector = ({ open }: { open: boolean }) => {
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language;
  const [langToggle, setLangToggle] = useState(
    currentLang == 'en' ? 'en' : 'ko',
  );

  useEffect(() => {
    i18n.changeLanguage(langToggle);
  }, [langToggle, i18n]);
  if (open)
    return (
      <Select
        value={currentLang}
        onValueChange={(lang) => i18n.changeLanguage(lang)}>
        <SelectTrigger className="w-[120px] border-none dark:bg-black md:dark:bg-none">
          <Globe />
          <SelectValue placeholder={t('Lang')} />
        </SelectTrigger>
        <SelectContent className="text-sm dark:bg-black md:dark:bg-none">
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="ko">한국어</SelectItem>
        </SelectContent>
      </Select>
    );
  return (
    <CustomTooltip content={t('tooltip.lang')} location="right">
      <Button
        variant="ghost"
        className="ml-[-2px] px-2 dark:bg-black md:dark:bg-none"
        onClick={() => setLangToggle(langToggle === 'en' ? 'ko' : 'en')}>
        {langToggle.toUpperCase()}
      </Button>
    </CustomTooltip>
  );
};
