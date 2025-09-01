import { useSignupSchema } from '../auth.schema';
import { useForm } from 'react-hook-form';
import { SignupForm } from '../auth.types';
import { zodResolver } from '@hookform/resolvers/zod';

// RHF + Zod 를 통해 회원가입 폼 상태를 설정
export const useSignupForm = () => {
  const signupSchema = useSignupSchema();
  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
      age: false,
      checkBox1: false,
      checkBox2: false,
    },
    mode: 'onChange', // UX 개선을 위해 실시간 validation
  });

  return form;
};
