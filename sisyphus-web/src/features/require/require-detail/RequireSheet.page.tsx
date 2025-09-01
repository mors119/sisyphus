import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import RequireDetailPage from './RequireDetail.widget';
import { useTranslation } from 'react-i18next';

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RequireSheet = ({ isOpen, setIsOpen }: Props) => {
  const { t } = useTranslation();
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t('require.sheet.detail')}</SheetTitle>
          <SheetDescription>{t('require.sheet.desc')}</SheetDescription>
        </SheetHeader>
        <RequireDetailPage setIsOpen={setIsOpen} />
      </SheetContent>
    </Sheet>
  );
};
