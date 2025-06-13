import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TagForm, tagSchema } from '@/lib/validations/tag';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { HexColorPicker } from 'react-colorful';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  useCreateTagMutation,
  useUpdateTagMutation,
} from '@/hooks/use-tag-query';
import { useAlert } from '@/hooks/use-alert';
import { useEffect, useRef, useState } from 'react';
import { useTagStore } from '@/stores/tag-store';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useClickAway } from 'react-use';
import { useColor } from '@/hooks/use-color';

interface UnifiedTagFormProps {
  defaultValues?: TagForm & { id?: number }; // 수정일 때만 id 존재
}

export const TagFormUnified = ({ defaultValues }: UnifiedTagFormProps) => {
  // const { data: tags } = useTagsQuery();
  const { alertMessage } = useAlert();
  const { onDone, tagData, editingTagId } = useTagStore();
  const isEdit = tagData?.id !== null && editingTagId !== 0;
  const tagArray = useTagStore((s) => s.tagArray); // tagArray 구독 (tag 항목 보기)
  const [isOpen, setIsOpen] = useState(false); // tag select
  const ref = useRef(null); // tagId 폼 ref
  useClickAway(ref, () => setIsOpen(false)); // 외부 영역 클릭 시 event
  const { getTextColorForHex } = useColor();

  const form = useForm<TagForm>({
    resolver: zodResolver(tagSchema),
    defaultValues: tagData ?? {
      title: '',
      color: '#ffcd49',
      parentId: '',
    },
  });

  const createMutation = useCreateTagMutation();
  const updateMutation = useUpdateTagMutation(tagData.id ?? -1);

  const onSubmit = async (values: TagForm) => {
    try {
      if (isEdit) {
        await updateMutation.mutateAsync(values);
        alertMessage('✅ 태그가 수정되었습니다.');
      } else {
        await createMutation.mutateAsync(values);
        alertMessage(`✅ '${values.title}' 태그가 추가되었습니다.`);
      }
      onDone();
      if (!isEdit) form.reset({ title: '', color: '#ffcd49', parentId: null });
    } catch (err) {
      alertMessage('❌ 처리 실패', {
        description: `다시 시도해주세요.\n${err}`,
      });
    }
  };

  useEffect(() => {
    if (defaultValues) form.reset(defaultValues);
  }, [defaultValues, form]);
  console.log(isEdit);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 items-start h-full">
        {/* 부모 태그 선택 */}

        <FormField
          control={form.control}
          name="parentId"
          render={({ field }) => {
            const selectedTag = tagArray.find((tag) => tag.id === field.value);
            return (
              <FormItem ref={ref}>
                <FormLabel className="hidden">TAG</FormLabel>
                <FormControl>
                  <div className="relative text-center">
                    <div
                      onClick={() => setIsOpen((prev) => !prev)}
                      className="border px-3 py-2 rounded cursor-pointer truncate w-50 hover:brightness-110"
                      style={{
                        backgroundColor: selectedTag?.color || 'white',
                        color: selectedTag ? '#fff' : '#000',
                      }}>
                      {selectedTag?.title || '태그 없음'}
                    </div>
                    {isOpen && (
                      <ul className="absolute z-10 w-full max-h-30 overflow-auto">
                        {tagArray?.map((tag) => (
                          <li
                            key={tag.id}
                            style={{
                              backgroundColor: tag.color,
                              color: getTextColorForHex(tag.color),
                            }}
                            className={cn(
                              'px-3 py-2 hover:brightness-110 cursor-pointer truncate rounded',
                              field.value === tag.id && 'font-bold',
                            )}
                            onClick={() => {
                              field.onChange(tag.id);
                              setIsOpen(false);
                            }}>
                            {tag.title}
                          </li>
                        ))}
                        <li
                          key="empty"
                          className="px-3 py-2 cursor-pointer rounded bg-gray-400 hover:brightness-110"
                          onClick={() => {
                            field.onChange('');
                            setIsOpen(false);
                          }}>
                          태그 없음
                        </li>
                      </ul>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        {/* 제목 */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="예: 업무, 개인" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 색상 */}
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn('size-10 p-0 border', 'rounded-md')}
                    style={{ backgroundColor: field.value }}
                  />
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2">
                  <HexColorPicker
                    color={field.value}
                    onChange={field.onChange}
                    className="w-40 h-40"
                  />
                  <Input
                    type="text"
                    value={field.value}
                    onChange={field.onChange}
                    className="mt-2 text-sm"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={createMutation.isPending || updateMutation?.isPending}>
            {isEdit ? '수정' : '추가'}
          </Button>
          <Button type="button" variant="outline" onClick={onDone}>
            취소
          </Button>
        </div>
      </form>
    </Form>
  );
};
