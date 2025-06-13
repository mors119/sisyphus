import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

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
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import {
  checkApi,
  sendVerificationCode,
  signupApi,
} from '@/services/auth/route';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';
import { useAlert } from '@/hooks/use-alert';
import { Checkbox } from '@/components/ui/checkbox';
import { AgreeForm } from './agree-form';
import { signupSchema, SignupForm } from '@/lib/validations/signup';
import { VerifyEmail } from './verify-email';

export const Signup = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from || '/'; // 없으면 홈으로

  const { alertMessage } = useAlert();
  const { setAccessToken } = useAuthStore();

  // disabled 제어
  const [isLoading, setIsLoading] = useState(false);

  // 이메일 인증 탭 열기
  const [openVerifyEmail, setOpenVerifyEmail] = useState(false);
  // 이메일 인증 버튼 활성화
  const [verified, setVerified] = useState(true);
  // 이메일 인증 시간
  const [secondsLeft, setSecondsLeft] = useState<number>(0); // 5분
  // 이메일 검증
  const [confirm, setConfirm] = useState(false);

  // 동의 내용
  const [showAgreeForm, setShowAgreeForm] = useState('0');
  // 비밀번호 보이기
  const [showPassword, setShowPassword] = useState(false);
  // 이메일 중복 확인
  const [emailChecked, setEmailChecked] = useState(false);

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
      checkBox1: false,
      checkBox2: false,
    },
  });

  const emailValue = form.watch('email');
  const password = form.watch('password');

  // 아이디 체크
  const handleCheck = () => {
    const email = form.getValues('email');
    setIsLoading(true);
    if (!email) {
      alertMessage('이메일을 먼저 입력해주세요!', { duration: 3000 });
      setIsLoading(false);
      return;
    }

    checkApi({ email })
      .then((res) => {
        if (res.data === true) {
          alertMessage('사용 중인 이메일 입니다.', {
            duration: 3000,
          });
          form.setValue('email', '');
          return;
        }
        if (res.data === false) {
          setEmailChecked(true);
          alertMessage('사용 가능한 이메일입니다', {
            description: `${email}`,
            duration: 3000,
          });
          // send email code
          setVerified(false);
        }
      })
      .catch((err) => {
        console.error(err);
        alertMessage('중복확인 중 오류가 발생했습니다.', {
          duration: 3000,
        });
      })
      .finally(() => setIsLoading(false));
  };

  // 폼 전송
  function onSubmit(values: SignupForm) {
    useAuthStore.getState().clear();
    localStorage.removeItem('auth-storage');

    const { name, email, password } = values;
    const checkbox1 = form.getValues('checkBox1');
    const checkbox2 = form.getValues('checkBox2');

    setIsLoading(true);

    if (!confirm) {
      alertMessage('이메일 인증이 필요합니다.', {
        duration: 3000,
      });
      setIsLoading(false);
      return;
    }

    if (emailChecked == false) {
      alertMessage('이메일 중복확인이 필요합니다.', {
        duration: 3000,
      });
      setIsLoading(false);
      return;
    }
    if (!checkbox1) {
      alertMessage('이용약관 동의가 필요합니다.', {
        duration: 3000,
      });
      setIsLoading(false);
      return;
    }
    if (!checkbox2) {
      alertMessage('개인정보 수집 및 이용 동의가 필요합니다.', {
        duration: 3000,
      });
      setIsLoading(false);
      return;
    }

    signupApi({ name, email, password })
      .then((res) => {
        const accessToken = res.data.accessToken;

        // accessToken 저장 (localstorage도 저장됨)
        setAccessToken(res.data.accessToken);

        // axios에 자동 설정 (전체 요청에 토큰 적용)
        axios.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${accessToken}`;
        alertMessage('회원가입 완료', {
          description: '회원가입을 축하드립니다! 🎉',
          duration: 3000,
        });

        navigate(from, { replace: true }); // 페이지로 이동
      })
      .catch((err) => {
        console.error('회원가입 실패:', err);
        alertMessage('회원가입 중 오류가 발생했습니다.', {
          duration: 3000,
        });
      })
      .finally(() => setIsLoading(false));
  }

  // 패스워드 형식
  const getPasswordStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score += 33;
    if (/[0-9]/.test(pw)) score += 33;
    if (/[!@#$%^&*()_\-+=<>?{}[\]~]/.test(pw)) score += 33;
    return score;
  };

  const strength = getPasswordStrength(password);

  // 이용약관 수집 동의서 보기
  const toggleAgreeForm = (target: string) => {
    setShowAgreeForm((prev) => (prev === target ? '0' : target));
  };

  // 이메일 인증 시간 (5분)
  useEffect(() => {
    if (openVerifyEmail) {
      setSecondsLeft(60 * 5); // 타이머 초기화

      const interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setOpenVerifyEmail(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [openVerifyEmail]);

  // 이메일 전송
  const onSendCode = async () => {
    try {
      setOpenVerifyEmail(true);
      await sendVerificationCode(emailValue);
      alertMessage('인증 코드가 전송되었습니다!');
    } catch (err) {
      console.error(err);
      alertMessage('이메일 전송 실패');
      setOpenVerifyEmail(false);
    }
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
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={'text'}
                        placeholder="이름이나 별명을 입력하세요."
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
                  <FormLabel>Email</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="example@email.com" {...field} />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      className=""
                      disabled={isLoading}
                      onClick={handleCheck}>
                      중복확인
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 이메일 검증 */}
            <DialogTrigger asChild>
              <Button
                variant="outline"
                type="button"
                className="w-full "
                onClick={onSendCode}
                disabled={verified || confirm}>
                {!verified && !emailChecked ? '인증 완료' : '인증 코드 전송'}
              </Button>
            </DialogTrigger>

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="비밀번호 입력"
                        {...field}
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2 text-sm  text-neutral-400">
                        {showPassword ? (
                          <Eye size={18} />
                        ) : (
                          <EyeOff size={18} />
                        )}
                      </span>
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
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="비밀번호 다시 입력"
                        {...field}
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2 text-sm  text-neutral-400">
                        {showPassword ? (
                          <Eye size={18} />
                        ) : (
                          <EyeOff size={18} />
                        )}
                      </span>
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
                    <FormLabel className="">
                      이용약관에 동의합니다. (필수)
                    </FormLabel>
                    <FormDescription className="text-xs">
                      이용약관
                      <span
                        role="button"
                        onClick={() => {
                          toggleAgreeForm('1');
                          setIsLoading(true);
                        }}
                        className="ml-1  text-blue-400 hover:underline duration-150">
                        보기
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
                      className=" mr-1"
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="">
                      개인정보 수집 및 이용에 동의합니다. (필수)
                    </FormLabel>
                    <FormDescription className="text-xs">
                      개인정보 수집 및 이용 동의서
                      <span
                        role="button"
                        onClick={() => {
                          toggleAgreeForm('2');
                          setIsLoading(true);
                        }}
                        className="ml-1  text-blue-400 hover:underline duration-150">
                        보기
                      </span>
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full " disabled={isLoading}>
              회원가입
            </Button>
          </form>
        </Form>
      </div>
    </Dialog>
  );
};
