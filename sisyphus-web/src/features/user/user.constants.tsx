import { FcGoogle } from 'react-icons/fc';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { SiNaver } from 'react-icons/si';
import { Provider, ProviderConfig } from './user.types';

export const PROVIDER_CONFIG: ProviderConfig[] = [
  {
    provider: Provider.CAMUS,
    icon: <img src="/logo/diagram-logo.png" alt="diagram" className="size-5" />,
    label: 'user.sisyphus',
    className: 'dark:bg-neutral-800',
    onClick: 'SIGNUP',
  },
  {
    provider: Provider.GOOGLE,
    icon: <FcGoogle size={22} />,
    label: 'user.google',
    className: 'dark:bg-white dark:text-black',
    onClick: `/api/auth/google?mode=link`,
  },
  {
    provider: Provider.NAVER,
    icon: <SiNaver size={16} color="white" />,
    label: 'user.naver',
    className: 'bg-[#00c75a] hover:bg-[#00c75a]/60 dark:bg-[#00c75a]',
    onClick: `/api/auth/naver?mode=link`,
  },
  {
    provider: Provider.KAKAO,
    icon: <RiKakaoTalkFill size={24} color="#3c1f1f" />,
    label: 'user.kakao',
    className:
      'bg-[#f9e000] text-[#3c1f1f] hover:bg-[#f9e000]/60 dark:bg-[#f9e000]',
    onClick: `/api/auth/kakao?mode=link`,
  },
];
