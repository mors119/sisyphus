import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { getColorUtils } from '@/utils/getColorUtils.util';
import { useClickAway } from 'react-use';
import { useRef, useState } from 'react';
import { CategoryData } from './category.types';
import { useTranslation } from 'react-i18next';

interface CategorySelectFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  name: string;
  categoryArray: CategoryData[];
}

export const CategorySelectField = ({
  control,
  name,
  categoryArray,
}: CategorySelectFieldProps) => {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const { getTextColorForHex } = getColorUtils();
  const { t } = useTranslation();
  useClickAway(ref, () => setIsOpen(false));

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedCategory = categoryArray.find(
          (category) => category.id === field.value,
        );

        return (
          <FormItem ref={ref}>
            <FormLabel className="hidden">
              {t('category.page.category')}
            </FormLabel>
            <FormControl>
              <div className="relative text-center">
                <button
                  type="button"
                  onClick={() => setIsOpen((prev) => !prev)}
                  className="border h-8 flex items-center justify-center rounded cursor-pointer truncate w-50 hover:brightness-110"
                  style={{
                    backgroundColor: selectedCategory?.color || 'black',
                    color: getTextColorForHex(
                      selectedCategory?.color ?? 'black',
                    ),
                  }}>
                  {selectedCategory?.title || t('category.none')}
                </button>

                {isOpen && (
                  <ul className="absolute z-10 w-full max-h-30 overflow-auto">
                    {categoryArray.map((category) => (
                      <li
                        key={category.id}
                        style={{
                          backgroundColor: category.color,
                          color: getTextColorForHex(category.color),
                        }}
                        className={cn(
                          'px-3 py-1 hover:brightness-110 cursor-pointer truncate rounded',
                          field.value === category.id && 'font-bold',
                        )}
                        onClick={() => {
                          field.onChange(category.id);
                          setIsOpen(false);
                        }}>
                        {category.title}
                      </li>
                    ))}
                    {field.value && (
                      <li
                        key="empty"
                        className="px-3 py-1 cursor-pointer rounded bg-black hover:brightness-110 text-white"
                        onClick={() => {
                          field.onChange(undefined);
                          setIsOpen(false);
                        }}>
                        {t('none')}
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
