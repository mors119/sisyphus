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
import { useTranslation } from 'react-i18next';

interface CustomAlertProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  desc: React.ReactNode;
  cancel?: string;
  onAction?: () => void;
  action: string;
}

export const CustomAlert = ({
  open,
  setOpen,
  title,
  desc,
  cancel,
  onAction,
  action,
}: CustomAlertProps) => {
  const { t } = useTranslation();
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="border-2">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{desc}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            className="bg-rose-500 text-white"
            onClick={onAction}>
            {action}
          </AlertDialogAction>
          <AlertDialogCancel className="text-white bg-black dark:bg-black">
            {cancel ? cancel : t('back')}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
