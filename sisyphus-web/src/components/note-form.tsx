import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAlert } from '@/hooks/use-alert';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { NoteForm, noteSchema } from '@/lib/validations/note';
import { Textarea } from '@/components/ui/textarea';
import { createNote } from '@/services/note/route';
import { useUpdateNoteMutation } from '@/hooks/use-notes-query';
import { useNoteStore } from '@/stores/note-store';
import { useTagStore } from '@/stores/tag-store';
import { useQueryClient } from '@tanstack/react-query';
import { normalizeNoteToForm } from '@/utils/convert-type';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { useDndStore } from '@/stores/dnd-store';
import { useClickAway } from 'react-use';
import { useColor } from '@/hooks/use-color';
import { CleanBtn } from './custom/custom-button';
import { useLocation } from 'react-router-dom';

export const NoteFormField = () => {
  const { category, done, editNote } = useNoteStore(); // note 관련
  const tagArray = useTagStore((s) => s.tagArray); // tagArray 구독 (tag 항목 보기)
  const { alertMessage } = useAlert(); // 메시지 띄우기
  const [isLoading, setIsLoading] = useState(false); // 활성/비활성
  const queryClient = useQueryClient(); // react query client
  const { activeDone, activeSubmit, activeTag } = useDndStore(); // dnd-kit 관련
  const { isOver, setNodeRef, active } = useDroppable({
    id: 'note-form',
    data: { type: 'note-form' },
  }); // drop zone
  const [isOpen, setIsOpen] = useState(false); // tag select
  const ref = useRef(null); // tagId 폼 ref
  useClickAway(ref, () => setIsOpen(false)); // 외부 영역 클릭 시 event
  const [open, setOpen] = useState(false); // category select
  const dropdownRef = useRef(null); // category ref
  useClickAway(dropdownRef, () => setOpen(false)); // category 외부 영역 클릭 시
  const { getTextColorForHex } = useColor();
  const location = useLocation(); // 현재 location

  const categoryOptions = [
    { label: '단어장', value: 'WORD' },
    { label: '노트', value: 'NOTE' },
    { label: '일정', value: 'TODO' },
  ];

  const defaultValues: NoteForm = {
    title: '',
    subTitle: '',
    description: '',
    tagId: undefined,
    category: 'NOTE',
  };

  const form = useForm<NoteForm>({
    resolver: zodResolver(noteSchema),
    defaultValues: defaultValues,
  });

  const isEdit = editNote.id !== 0 || editNote.tag?.id; // edit 모드 확인

  useEffect(() => {
    if (!isEdit) return; // edit 모드가 아니면 return
    const noteData = normalizeNoteToForm(editNote); // NoteForm 타입으로 변환 (3) [3]
    form.reset(noteData); // editNote 적용
    // console.log('(3)[3]', noteData);
  }, [isEdit, editNote]);

  const { mutateAsync: updateNoteMutate } = useUpdateNoteMutation();

  const onSubmit = async (values: NoteForm) => {
    // console.log([5]);
    setIsLoading(true);

    try {
      if (isEdit) {
        await updateNoteMutate({ id: editNote.id, data: values }); // 업데이트
        alertMessage('수정 성공 ✅', {
          description: '노트를 수정했습니다.',
          duration: 3000,
        });
        // console.log('[6]');
      } else {
        const res = await createNote(values); // 생성
        if (res.data === 'success') {
          alertMessage('생성 성공 ✅', {
            description: '노트를 추가했습니다.',
            duration: 3000,
          });
        }
      }
      // update 시 note-field refetch
      await queryClient.invalidateQueries({
        queryKey: ['tagNullNotes', category],
      });
    } catch (err) {
      console.error(err);
      alertMessage('실패 ❌', {
        description: '다시 시도해주세요.',
        duration: 3000,
      });
    } finally {
      setTimeout(() => {
        activeDone(); // submit 후 약간의 시간 뒤에 상태 초기화
        setIsLoading(false); // 비활성화 끄기
        done(); // editNote 비우기
        form.reset(defaultValues);
      }, 300);
    }
  };

  const { handleSubmit, watch } = form;
  const tagId = watch('tagId');

  // activeSubmit이 over 되면 submit
  useEffect(() => {
    console.log(tagId, editNote);
    if (tagId && editNote.id && activeSubmit) {
      // console.log('[4]');
      handleSubmit(onSubmit)(); // [4]
    }
  }, [tagId, editNote]);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'relative w-full h-full  rounded-lg transition-all duration-300',
        isOver
          ? 'border-blue-400 bg-blue-50 p-4 border-2 border-dashed'
          : 'border-gray-300 bg-white',
      )}>
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300 font-bold',
          !activeSubmit && activeTag && active?.id
            ? 'text-blue-600 border-4 border-blue-300 bg-blue-50 bg-opacity-50'
            : 'hidden',
          isOver &&
            'z-50 text-white border-4 border-dashed border-blue-600 bg-gradient-to-br from-blue-500 via-blue-400 to-blue-600 shadow-xl',
        )}>
        {isOver ? 'Dorp here' : 'Drop tag here to apply'}
      </div>
      <Form {...form} key={editNote?.id > 0 ? editNote.id : 'new'}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full flex flex-1 flex-col">
          <div className="flex justify-end gap-3 items-center">
            {/* /edit 일 때만 비우기 버튼  */}
            {location.pathname === '/edit' && (
              <CleanBtn
                onClick={() => {
                  done();
                  form.reset(defaultValues);
                }}
              />
            )}
            {/* tagId */}
            <FormField
              control={form.control}
              name="tagId"
              render={({ field }) => {
                const selectedTag = tagArray.find(
                  (tag) => tag.id === field.value,
                );
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
                                field.onChange(undefined);
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

            {/* category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => {
                const selected = categoryOptions.find(
                  (opt) => opt.value === field.value,
                );
                return (
                  <FormItem className="flex flex-col text-center">
                    <FormLabel className="hidden">CATEGORY</FormLabel>
                    <FormControl>
                      <div className="relative" ref={dropdownRef}>
                        <div
                          className="border px-3 py-2 rounded cursor-pointer bg-white truncate w-50"
                          onClick={() => setOpen((prev) => !prev)}>
                          {selected?.label || '카테고리 없음'}
                        </div>
                        {open && (
                          <ul className="absolute z-10 mt-1 w-full border rounded bg-white shadow-md max-h-60 overflow-auto">
                            {categoryOptions.map((opt) => (
                              <li
                                key={opt.value}
                                className={cn(
                                  'px-3 py-2 hover:bg-blue-100 cursor-pointer truncate',
                                  field.value === opt.value &&
                                    'bg-blue-50 font-semibold',
                                )}
                                onClick={() => {
                                  field.onChange(opt.value);
                                  setOpen(false);
                                }}>
                                {opt.label}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          {/* title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>TITLE</FormLabel>
                <FormControl>
                  <Input placeholder="제목" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* subTitle */}
          <FormField
            control={form.control}
            name="subTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SUBTITLE</FormLabel>
                <FormControl>
                  <Input placeholder="소제목" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>DESCRIPTION</FormLabel>
                <FormControl>
                  <Textarea
                    className="w-full max-h-80"
                    placeholder="설명"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isEdit ? '수정' : '추가'}
          </Button>
        </form>
      </Form>
    </div>
  );
};
