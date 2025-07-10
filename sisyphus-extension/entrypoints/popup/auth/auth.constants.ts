import { FcGoogle } from 'react-icons/fc';
import { SiNaver } from 'react-icons/si';
import { RiKakaoTalkFill } from 'react-icons/ri';

export const AUTH_TYPE = [
  {
    id: 'google',
    label: 'Google login',
    icon: FcGoogle,
    size: 22,
    bgColor: 'white',
  },
  {
    id: 'naver',
    label: 'Naver login',
    icon: SiNaver,
    size: 16,
    color: 'white',
    bgColor: '#00c75a',
  },
  {
    id: 'kakao',
    label: 'Kakao login',
    icon: RiKakaoTalkFill,
    size: 25,
    color: '#3c1f1f',
    bgColor: '#f9e000',
  },
];

// Backend Oauth Url
// TODO: 배포 시 변경
export const BACK_URL = 'http://localhost:8080/api';
export const OAUTH_URL = `${BACK_URL}/api/auth`;
export const REDIRECT_URL = `https://${chrome.runtime.id}.chromiumapp.org`;
export const HOST_URL = 'http://localhost:5173';
