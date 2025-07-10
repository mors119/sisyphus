import { useForm } from 'react-hook-form';
import { UserForm } from './user.types';
import { useUserSchema } from './user.schema';
import { zodResolver } from '@hookform/resolvers/zod';

export const useUserForm = () => {
  const schema = useUserSchema();
  const form = useForm<UserForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      createdAt: '',
    },
    mode: 'onBlur',
  });
  return form;
};
