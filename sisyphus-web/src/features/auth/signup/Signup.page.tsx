import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAlert } from '@/hooks/useAlert';
import { Checkbox } from '@/components/ui/checkbox';
import { AgreeForm } from './AgreeForm.dialog';
import { VerifyEmail } from './VerifyEmail.container';
import {
  useCheckEmailMutation,
  useSendVerificationMutation,
  useSignupMutation,
} from './useSignupMutation.mutation';
import { useTranslation } from 'react-i18next';
import { SignupForm } from '../auth.types';
import { useSignupForm } from './useSignupForm.hook';
import { usePasswordStrength } from './passwordStrength.util';
import { useEmailVerificationTimer } from './useEmailVerificationTimer.hook';
import { VerifyEmailBtn } from './VerifyEmailBtn.component';
import { ShowPasswordBtn } from './ShowPasswordBtn.component';
import { useAuthStore } from '../auth.store';
import { PATHS } from '@/app/router/paths.constants';
import { useSignupValidationMessage } from './useSignupValidationMessage.hook';

const Signup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { alertMessage } = useAlert();
  const from = location.state?.from || PATHS.HOME; // 없으면 홈으로
  const { t } = useTranslation();
  const form = useSignupForm();

  // disabled 제어
  const [isLoading, setIsLoading] = useState(false);
  // 이메일 인증 탭 열기
  const [openVerifyEmail, setOpenVerifyEmail] = useState(false);
  const { secondsLeft } = useEmailVerificationTimer(openVerifyEmail);
  // 이메일 인증 버튼 활성화
  const [verified, setVerified] = useState(true);
  // 이메일 검증
  const [confirm, setConfirm] = useState(false);
  // 동의 내용
  const [showAgreeForm, setShowAgreeForm] = useState('0');
  // 비밀번호 보이기
  const [showPassword, setShowPassword] = useState(false);
  // 이메일 중복 확인
  const [emailChecked, setEmailChecked] = useState(false);

  const checkBox1 = form.watch('checkBox1');
  const checkBox2 = form.watch('checkBox2');
  const { msg } = useSignupValidationMessage(
    confirm,
    emailChecked,
    checkBox1,
    checkBox2,
  );

  const emailValue = form.watch('email');
  // 비밀번호 강도 체크
  const password = form.watch('password');
  const strength = usePasswordStrength(password);

  // 아이디 체크
  const { mutate: checkEmail } = useCheckEmailMutation(() => {
    setEmailChecked(true);
    setVerified(false);
  });

  const handleCheck = () => {
    const email = form.getValues('email');
    if (!email) {
      alertMessage(t('signup.enterEmail'), { duration: 3000 });
      return;
    }
    checkEmail({ email });
  };

  // 폼 전송
  const { mutate: signupMutation } = useSignupMutation(() =>
    navigate(from, { replace: true }),
  );

  const onSubmit = (values: SignupForm) => {
    const { name, email, password } = values;

    if (msg.length > 0) {
      alertMessage(t(msg), {
        duration: 3000,
      });
      setIsLoading(false);
      return;
    }

    useAuthStore.getState().clear();
    localStorage.removeItem('auth-storage');

    signupMutation({ name, email, password });
  };

  // 이용약관 수집 동의서 보기
  const toggleAgreeForm = (target: string) => {
    setShowAgreeForm((prev) => (prev === target ? '0' : target));
  };

  // 이메일 전송
  const { mutate: sendCode } = useSendVerificationMutation();

  const onSendCode = () => {
    setOpenVerifyEmail(true);
    sendCode(emailValue, {
      onError: () => setOpenVerifyEmail(false),
    });
  };

  return (
    <Dialog open={openVerifyEmail} onOpenChange={setOpenVerifyEmail}>
      <VerifyEmail
        emailValue={emailValue}
        open={openVerifyEmail}
        secondsLeft={secondsLeft}
        setOpen={setOpenVerifyEmail}
        setConfirm={setConfirm}
      />
      <div className="flex justify-center items-center h-full mx-auto w-full relative">
        <AgreeForm
          show={showAgreeForm}
          setShow={setShowAgreeForm}
          onClose={() => setShowAgreeForm('0')}
          setIsLoading={() => setIsLoading(!isLoading)}
        />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-[320px] ">
            {/* User name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('signup.name')}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        autoComplete="username"
                        type={'text'}
                        placeholder={t('signup.nickname')}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('signup.email')}</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        autoComplete="email"
                        placeholder="example@email.com"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isLoading}
                      onClick={handleCheck}>
                      {t('signup.checkRedundancy')}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 이메일 검증 */}
            <VerifyEmailBtn
              confirm={confirm}
              onSendCode={onSendCode}
              verified={verified}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('signup.pass')}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        autoComplete="new-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t('signup.pass')}
                        {...field}
                      />
                      <ShowPasswordBtn
                        show={showPassword}
                        setShow={setShowPassword}
                      />
                    </div>
                  </FormControl>
                  {password && (
                    <Progress value={strength} className={cn('h-1 mt-2')} />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Confirm */}
            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('signup.passConfirm')}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t('signup.passConfirm')}
                        {...field}
                      />
                      <ShowPasswordBtn
                        show={showPassword}
                        setShow={setShowPassword}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="checkBox1"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-2 shadow">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      className=" mr-1"
                      disabled={isLoading}
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none ">
                    <FormLabel>{t('signup.agreeTerms')}</FormLabel>
                    <FormDescription className="text-xs">
                      {t('signup.terms')}
                      <span
                        role="button"
                        onClick={() => {
                          toggleAgreeForm('1');
                          setIsLoading(true);
                        }}
                        className="ml-1  text-blue-400 hover:underline duration-150">
                        {t('signup.view')}
                      </span>
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="checkBox2"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-2 shadow">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      disabled={isLoading}
                      className="mr-1"
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t('signup.agreeInfo')}</FormLabel>
                    <FormDescription className="text-xs">
                      {t('signup.personalInfo')}
                      <span
                        role="button"
                        onClick={() => {
                          toggleAgreeForm('2');
                          setIsLoading(true);
                        }}
                        className="ml-1  text-blue-400 hover:underline duration-150">
                        {t('signup.view')}
                      </span>
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full " disabled={isLoading}>
              {t('signup.signup')}
            </Button>
          </form>
        </Form>
      </div>
    </Dialog>
  );
};

export default Signup;
