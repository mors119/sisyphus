import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserResponse } from '@/types/user';

interface CustomAvatarProps {
  user?: UserResponse | null;
}

export const CustomAvatar = ({ user }: CustomAvatarProps) => {
  if (!user) return null;

  return (
    <Button
      variant="sisyphus"
      className="flex items-center gap-2 px-2 border-none"
      asChild>
      <div className="flex items-center gap-2">
        <span className="hidden xl:inline-block text-sm">{user.name}</span>
        <Avatar className="border border-point-yellow">
          <AvatarFallback className="border border-point-blue">
            {user.name
              ? user.name.at(0)?.toUpperCase()
              : user.email.at(0)?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
    </Button>
  );
};
