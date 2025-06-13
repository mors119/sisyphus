import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { useState } from 'react';

export const SearchBar = () => {
  const [open, setOpen] = useState(false);

  // TODO: 태그, 제목, 부제목, 설명으로 검색하기

  return (
    <>
      <div
        className={cn(
          'flex items-center border rounded-md w-full h-9 px-3 gap-2',
          'max-w-[720px] min-w-[120px]',
          'bg-white hover:border-[#1186ce] transition',
          open ? 'border-2 border-point-blue' : 'border-gray-300',
        )}>
        <Search
          className={cn('w-4 h-4 text-gray-400', open && 'text-point-blue')}
        />
        <input
          type="text"
          onClick={() => setOpen(true)}
          placeholder="Search"
          className={cn(
            'w-full bg-transparent outline-none border-none focus:ring-0 text-sm placeholder:text-gray-400',
            open && 'placeholder:text-[#1186ce]',
          )}
        />
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>Calendar</CommandItem>
            <CommandItem>Search Emoji</CommandItem>
            <CommandItem>Calculator</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};
