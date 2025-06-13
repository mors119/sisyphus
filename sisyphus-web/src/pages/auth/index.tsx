import { useState } from 'react';

import { Logo } from '../../components/logo';
import { Signin } from './signin';
import { Signup } from './signup';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { FcGoogle } from 'react-icons/fc';
import { SiNaver } from 'react-icons/si';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { useAuthStore } from '@/stores/auth-store';

const AuthPage = () => {
  const loginButtons = [
    {
      id: 'google',
      label: 'Google login',
      icon: <FcGoogle size={22} />,
      bgColor: 'bg-white',
    },
    {
      id: 'naver',
      label: 'Naver login',
      icon: <SiNaver size={16} color="white" />,
      bgColor: 'bg-[#00c75a]',
    },
    {
      id: 'kakao',
      label: 'Kakao login',
      icon: <RiKakaoTalkFill size={25} color="#3c1f1f" />,
      bgColor: 'bg-[#f9e000]',
    },
  ];

  const query = new URLSearchParams(window.location.search);
  const page = query.get('page');

  // TODO: 배포 시 변경
  const url = 'http://localhost:8080/oauth2/authorization';

  const [inAndUp, setInAndUp] = useState(page ? page : 'signin');

  const handleLogin = (provider: string) => {
    useAuthStore.getState().clear();
    localStorage.removeItem('auth-storage');
    window.location.href = `${url}/${provider}`;
  };

  return (
    <div className="flex flex-col items-center mx-auto w-full h-full">
      <Logo className="py-10" />
      <div className="border-2 border-point-yellow p-1 rounded-xl bg-white">
        <div className="border-2 p-4 border-point-blue rounded-xl">
          <h1 className="text-center text-xl pb-3 font-semibold text-accent-foreground">
            {inAndUp === 'signin' ? 'Sign in' : 'Sign up'}
          </h1>
          {inAndUp === 'signin' ? <Signin /> : <Signup />}
          <div className="text-xs pt-2 flex justify-center">
            <p className="mr-1">
              {inAndUp === 'signin'
                ? '아직 가입하지 않으셨나요?'
                : '이미 가입된 아이디가 있으신가요?'}
            </p>
            <span
              role="button"
              onClick={() =>
                setInAndUp(inAndUp === 'signin' ? 'signup' : 'signin')
              }
              className="text-blue-500  hover:underline">
              {inAndUp === 'signin' ? '회원가입' : '로그인'}
            </span>
          </div>
          <Separator className="my-4 relative flex justify-center">
            <span className="absolute -top-1.5  text-xs bg-white px-2 text-neutral-400">
              간편 로그인
            </span>
          </Separator>

          <div className="flex gap-3 justify-center">
            {loginButtons.map(({ id, label, icon, bgColor }) => (
              <Tooltip key={id}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className={`border cursor-pointer size-9 rounded-[50%] flex items-center justify-center ${bgColor}`}
                    onClick={() => handleLogin(id)}>
                    {icon}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
