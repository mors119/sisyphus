import { FcGoogle } from 'react-icons/fc';
import { SiNaver } from 'react-icons/si';
import { RiKakaoTalkFill } from 'react-icons/ri';

export const AUTH_TYPE = [
  {
    id: 'google',
    label: 'Google login',
    icon: FcGoogle,
    size: 22,

    bgColor: 'bg-white',
  },
  {
    id: 'naver',
    label: 'Naver login',
    icon: SiNaver,
    size: 16,
    color: 'white',
    bgColor: 'bg-[#00c75a]',
  },
  {
    id: 'kakao',
    label: 'Kakao login',
    icon: RiKakaoTalkFill,
    size: 25,
    color: '#3c1f1f',
    bgColor: 'bg-[#f9e000]',
  },
];

// Backend Oauth Url
// TODO: 배포 시 변경
export const OAUTH_URL = `${import.meta.env.VITE_BACKEND_URL}/api/auth`;
