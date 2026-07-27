import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserResponse } from '@/features/user/user.types';

interface CustomAvatarProps {
  user?: UserResponse | null;
}

export const CustomAvatar = ({ user }: CustomAvatarProps) => {
  if (!user) return null;

  return (
    <Button
      variant="sisyphus"
      className="flex items-center gap-2 px-2 border-none group"
      asChild>
      <div className="flex items-center gap-2">
        <span className="hidden text-sm text-brand-accent xl:inline-block">
          {user.name}
        </span>
        <Avatar className="border border-sisy">
          <AvatarFallback className="border border-brand-primary dark:text-brand-accent group-hover:dark:bg-action-primary">
            {user.name
              ? user.name.charAt(0).toUpperCase()
              : user.email.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
    </Button>
  );
};
