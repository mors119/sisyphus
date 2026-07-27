import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { SearchDialog } from './SearchDialog.container';
import { useAuthStore } from '@/features/auth/auth.store';
import { useNavigate } from 'react-router-dom';

export const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const { accessToken } = useAuthStore();
  const navigate = useNavigate();
  return (
    <div
      className={cn(
        'flex items-center border rounded-md w-full h-9 px-3 gap-2',
        'max-w-[720px] min-w-[120px]',
        'bg-white transition hover:border-brand-primary',
        open ? 'border-2 border-sis' : 'border-gray-300',
      )}>
      <Search className={cn('w-4 h-4 text-gray-400', open && 'text-sis')} />
      <input
        type="text"
        onClick={() => {
          if (accessToken) setOpen(true);
          else navigate('/auth/signin?alert=auth_required');
        }}
        placeholder="Search"
        className={cn(
          'w-full bg-transparent outline-none border-none focus:ring-0 text-sm placeholder:text-gray-400',
          open && 'placeholder:text-info',
        )}
      />
      <SearchDialog open={open} setOpen={setOpen} />
    </div>
  );
};
