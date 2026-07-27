import { Button } from '@/components/ui/button';
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
    window.location.href = `/api/auth/${ItemId}`;
  };

  return (
    <Button
      type="button"
      variant="outline"
      className={`w-full rounded-md ${item.bgColor}`}
      onClick={() => handleLogin(item.id)}>
      <item.icon size={item.size} color={item.color} />
      <span>{item.label}</span>
    </Button>
  );
};
