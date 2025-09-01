import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { useAuthStore } from '../auth.store';

type AuthType = {
  id: string;
  label: string;
  icon: React.ElementType;
  size: number;
  color?: string;
  bgColor: string;
};

export const SocialLoginButton = ({ item }: { item: AuthType }) => {
  const handleLogin = (ItemId: string) => {
    useAuthStore.getState().clear();
    localStorage.removeItem('auth-storage');
    window.location.href = `/api/auth/${ItemId}`;
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={`border cursor-pointer size-9 rounded-[50%] flex items-center justify-center ${item.bgColor}`}
          onClick={() => handleLogin(item.id)}>
          <item.icon size={item.size} color={item.color} />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{item.label}</p>
      </TooltipContent>
    </Tooltip>
  );
};
