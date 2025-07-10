import { cn } from '@/lib/utils';

interface LogoProps {
  open: boolean;
}

export const Logo = ({ open }: LogoProps) => {
  return (
    <>
      <img
        src="/logo/diagram-logo.png"
        alt="diagram logo"
        className={cn(
          'max-h-14 hidden md:block',
          open && 'absolute top-0 left-0',
        )}
      />
      <img
        src="/logo/text-logo.png"
        alt="text logo"
        className={cn(
          'md:absolute md:w-48 w-40',
          open && 'w-48 top-[50] right-0',
        )}
      />
    </>
  );
};
