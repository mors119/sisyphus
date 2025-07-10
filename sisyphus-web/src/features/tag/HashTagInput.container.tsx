import { useEffect, useMemo, useState } from 'react';
import { CustomTooltip } from '@/components/custom/customTooltip';
import { TagTemp } from './tag.type';
import { useTagStore } from './tag.store';
import { useFetchTags } from './useTag.query';
import { useTranslation } from 'react-i18next';

interface HashTagInputProps {
  value?: TagTemp[];
  onChange: (tags: TagTemp[]) => void;
}

export const HashTagInput = ({ value, onChange }: HashTagInputProps) => {
  const safeValue = Array.isArray(value) ? value : [];
  const [inputValue, setInputValue] = useState('');
  const { tags, setTags } = useTagStore();
  const [focusedIndex, setFocusedIndex] = useState(-1); // 드롭다운 항목 선택 상태
  const { data } = useFetchTags();
  const { t } = useTranslation();

  useEffect(() => {
    if (data) setTags(data);
  }, [data]);

  const addTempTag = (tag: TagTemp) =>
    onChange(
      safeValue.some((t) => t.name === tag.name)
        ? safeValue
        : [...safeValue, tag],
    );

  const removeTempTag = (id: number) =>
    onChange(safeValue.filter((t) => t.id !== id));

  const suggestions = useMemo(() => {
    const v = inputValue.trim().toLowerCase();
    if (!v) return [];
    return tags.filter((t) => t.name.toLowerCase().includes(v)).slice(0, 5);
  }, [inputValue, tags]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (focusedIndex >= 0 && suggestions[focusedIndex]) {
        const tag = suggestions[focusedIndex];
        addTempTag({ id: tag.id, name: tag.name });
        setInputValue('');
        setFocusedIndex(-1);
      } else {
        const value = inputValue.trim().replace(/^#/, '');
        if (value) {
          addTempTag({ id: Date.now(), name: value });
          setInputValue('');
          setFocusedIndex(-1);
        }
      }
    } else if (e.key === 'Backspace' && inputValue === '' && safeValue.length) {
      removeTempTag(safeValue[safeValue.length - 1].id);
    }
  };

  // 포커싱된 항목의 텍스트를 input에 보여줌
  const currentSuggestion =
    focusedIndex >= 0 ? suggestions[focusedIndex] : null;

  return (
    <div className="relative bg-white dark:bg-neutral-900 border rounded-lg shadow-sm">
      <div className="flex flex-wrap items-center gap-2 px-3 py-2 min-h-[48px]">
        {safeValue.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center gap-1 px-3 py-1 text-sm rounded-full border border-neutral-300 dark:border-neutral-700 bg-blue-50 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200">
            <CustomTooltip content={t('tags.tip.delete')} location="top">
              <button
                type="button"
                onClick={() => removeTempTag(tag.id)}
                className="hover:text-red-500 transition-colors duration-150">
                # {tag.name}
              </button>
            </CustomTooltip>
          </div>
        ))}

        <input
          type="text"
          className="flex-1 min-w-[120px] text-sm bg-transparent focus:outline-none px-1 py-1"
          placeholder={t('tags.placeholder')}
          value={currentSuggestion?.name || inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setFocusedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
        />
      </div>

      {suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 mt-1 z-10 bg-white dark:bg-neutral-800 border rounded-md shadow-lg max-h-40 overflow-auto">
          {suggestions.map((s, i) => (
            <li
              key={s.id}
              className={`px-3 py-2 text-sm cursor-pointer ${
                i === focusedIndex
                  ? 'bg-blue-100 dark:bg-blue-900/40'
                  : 'hover:bg-blue-50 dark:hover:bg-blue-800/40'
              }`}
              onMouseEnter={() => setFocusedIndex(i)}
              onClick={() => {
                addTempTag({ id: s.id, name: s.name });
                setInputValue('');
                setFocusedIndex(-1);
              }}>
              # {s.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
