import { CustomAlert } from '@/components/custom/customAlert';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '@/hooks/useAlert';
import { PATHS } from '@/app/router/paths.constants';
import { useUserDeleteMutation } from './useUser.mutation';

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DeleteUserAlert = ({ open, setOpen }: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { alertMessage } = useAlert();
  const deleteMutation = useUserDeleteMutation(() => {
    alertMessage(t('user.delete.title'), {
      description: t('user.delete.title'),
      duration: 3000,
    });
    navigate(PATHS.HOME);
  });
  return (
    <CustomAlert
      title={t('user.alert.title')}
      desc={
        <span>
          {t('user.alert.desc.p1')}{' '}
          <span className="text-red-600">{t('user.alert.desc.p2')}</span>
          <br />
          <strong className="text-red-600">{t('user.alert.desc.p3')}</strong>
        </span>
      }
      action={t('user.alert.action')}
      open={open}
      setOpen={setOpen}
      onAction={() => deleteMutation.mutate()}
    />
  );
};
