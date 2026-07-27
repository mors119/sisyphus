import { FcGoogle } from 'react-icons/fc';
// import { SiNaver } from 'react-icons/si';
// import { RiKakaoTalkFill } from 'react-icons/ri';

export const AUTH_TYPE = [
  {
    id: 'google',
    labelKey: 'main.auth.social.google',
    icon: FcGoogle,
    size: 22,
    bgColor: 'white',
  },
  // Naver/Kakao OAuth is temporarily disabled.
  // {
  //   id: 'naver',
  //   labelKey: 'main.auth.social.naver',
  //   icon: SiNaver,
  //   size: 16,
  //   color: 'white',
  //   bgColor: '#00c75a',
  // },
  // {
  //   id: 'kakao',
  //   labelKey: 'main.auth.social.kakao',
  //   icon: RiKakaoTalkFill,
  //   size: 25,
  //   color: '#3c1f1f',
  //   bgColor: '#f9e000',
  // },
];

// Backend Oauth Url
// TODO: 배포 시 변경
export const BACK_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://sisyphus.mors.world/api'
    : 'http://localhost:8080/api';
export const REDIRECT_URL = `https://${chrome.runtime.id}.chromiumapp.org`;
export const HOST_URL = 'https://sisyphus.mors.world';
