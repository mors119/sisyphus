import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useEffect, useState } from 'react';
import { useSearchQuery } from './search.query';
import { Loader } from '@/components/custom/Loader';
import { useTranslation } from 'react-i18next';
import { ErrorState } from '@/components/custom/Error';
import { SearchResponse } from './search.type';
import { Book, Folder, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SEARCH_ITEM } from './search.constants';

interface SearchDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SearchDialog = ({ open, setOpen }: SearchDialogProps) => {
  const [query, setQuery] = useState('');
  const typeOrder = Object.values(SEARCH_ITEM); // 정렬 순서
  const { t } = useTranslation();
  const { data, isLoading, isError } = useSearchQuery(query);
  const navigate = useNavigate();

  const typeIcon = (type: string, num: number) => {
    switch (type) {
      case SEARCH_ITEM.NOTE:
        return num === 2 ? '• ' : <Book size={10} />;

      case SEARCH_ITEM.TAG:
        return num === 2 ? '# ' : <Tag size={10} />;

      case SEARCH_ITEM.CATE:
        return num === 2 ? '- ' : <Folder size={10} />;

      default:
        return null;
    }
  };

  const handleSelect = (t: string) => {
    const [type, id, title] = t.split(':::');
    console.log({ type, id, title });

    navigate(`/view?type=${type}&id=${id}&title=${encodeURIComponent(title)}`);
    setOpen(false);
  };

  useEffect(() => {
    setQuery('');
  }, [open]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder={t('search.place')}
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {isError ? (
          <ErrorState />
        ) : isLoading ? (
          <Loader />
        ) : data && data.length > 0 ? (
          Object.entries(
            data.reduce<Record<string, SearchResponse[]>>((acc, item) => {
              if (!acc[item.type]) acc[item.type] = [];
              acc[item.type].push(item);
              return acc;
            }, {}),
          )
            .sort(
              ([a], [b]) =>
                typeOrder.indexOf(a as SEARCH_ITEM) -
                typeOrder.indexOf(b as SEARCH_ITEM),
            )
            .map(([type, items]) => (
              <CommandGroup
                key={`${type}-${items.length}`}
                heading={
                  <span className="flex items-center gap-2">
                    {typeIcon(type, 1)}
                    {t(`item.${type}`, type)} {/* fallback 추가 */}
                  </span>
                }>
                {items.map((item) => (
                  <CommandItem
                    key={`${item.type}-${item.id}`}
                    className="cursor-pointer"
                    value={`${item.type}:::${item.id}:::${item.title}`}
                    onSelect={handleSelect}>
                    {item.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))
        ) : (
          <CommandEmpty>{t('search.no_result')}</CommandEmpty>
        )}
      </CommandList>
    </CommandDialog>
  );
};
