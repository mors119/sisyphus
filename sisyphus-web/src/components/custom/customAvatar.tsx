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
        <span className="hidden xl:inline-block text-sm dark:text-[#ffcd49] text-[#ffcd49]">
          {user.name}
        </span>
        <Avatar className="border border-point-yellow">
          <AvatarFallback className="border border-point-blue dark:text-[#ffcd49] group-hover:dark:bg-[#1186ce]">
            {user.name
              ? user.name.at(0)?.toUpperCase()
              : user.email.at(0)?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
    </Button>
  );
};
