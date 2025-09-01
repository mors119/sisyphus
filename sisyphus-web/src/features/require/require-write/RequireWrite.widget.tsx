import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RequireFormField } from './RequireFormField.container';
import { RequireCate } from '../require.types';
import { useTranslation } from 'react-i18next';

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  type: RequireCate;
}

export const RequireWrite = ({ isOpen, setIsOpen, type }: Props) => {
  const { t } = useTranslation();
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t(
              type === RequireCate.Bug
                ? 'require.view.bug'
                : 'require.view.req',
            )}
          </DialogTitle>
          <DialogDescription>
            {t('require.write.desc')}
            {t(
              type === RequireCate.Bug
                ? 'require.view.bug'
                : 'require.view.req',
            )}

            {t('require.write.desc2')}
          </DialogDescription>
        </DialogHeader>
        <RequireFormField setIsOpen={setIsOpen} type={type} />
      </DialogContent>
    </Dialog>
  );
};
