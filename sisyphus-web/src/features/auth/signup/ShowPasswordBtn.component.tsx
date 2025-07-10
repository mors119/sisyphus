import { Eye, EyeOff } from 'lucide-react';

interface ShowPasswordBtnProps {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  show: boolean;
}

export const ShowPasswordBtn = ({ setShow, show }: ShowPasswordBtnProps) => {
  return (
    <span
      onClick={() => setShow(!show)}
      className="absolute right-3 top-2 text-sm  text-neutral-400">
      {show ? <Eye size={18} /> : <EyeOff size={18} />}
    </span>
  );
};
