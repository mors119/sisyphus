import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

import { useEffect, useState } from 'react';
import { useImageDropzone } from './useImageDropzone.hook';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NoteForm } from '../quick_edit/note.types';
import { UseFormReturn } from 'react-hook-form';

interface ImageProps {
  form: UseFormReturn<NoteForm>;
}

export function ImageUploaderForm({ form }: ImageProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Dropzone props 생성
  const { getRootProps, getInputProps, isDragActive } = useImageDropzone({
    setFile: (file) => form.setValue('file', file),
    setPreviewUrl,
  });

  useEffect(() => {
    // previewUrl이 변경될 때 이전 URL을 해제하지 않으면 메모리 누수 발생
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // const onSubmit = async (data: ImageForm) => {
  //   try {
  //     const compressed = await imageCompression(data.file, {
  //       maxSizeMB: 1,
  //       maxWidthOrHeight: 1280,
  //       useWebWorker: true,
  //     });

  //     const formData = new FormData();
  //     formData.append('file', compressed);

  //     const res = await fetch('/api/upload', {
  //       method: 'POST',
  //       body: formData,
  //     });

  //     const result = await res.json();
  //     console.log('업로드 결과:', result);
  //   } catch (err) {
  //     console.error('업로드 실패:', err);
  //   }
  // };

  return (
    <FormField
      control={form.control}
      name="file"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="hidden">이미지 업로드</FormLabel>
          <FormControl>
            <div className="flex">
              {previewUrl && (
                <div className=" max-w-16 max-h-16">
                  <button
                    type="button"
                    onClick={() => {
                      form.setValue('file', undefined as unknown as File, {
                        shouldValidate: true, // shouldValidate: true 또는 shouldDirty: true를 주면 FormMessage에 즉시 반영
                      });
                      setPreviewUrl(null);
                    }}>
                    <img
                      src={previewUrl}
                      alt="preview"
                      className="mt-2 w-full h-full mx-auto"
                    />
                  </button>
                  {/* <p className="text-xs">
                        {field.value && field.value.name}
                      </p> */}
                </div>
              )}
              {!field.value && (
                <div
                  {...getRootProps()}
                  className={cn(
                    `border-2 p-2 border-dashed rounded flex cursor-pointer w-20 max-h-16 justify-center items-center`,
                    isDragActive
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-gray-300',
                  )}>
                  <div
                    className={cn(
                      'flex items-center gap-0.5',
                      isDragActive && 'text-blue-400 ',
                    )}>
                    {/* TODO: image 이미지 */}
                    <p className="text-xs">image</p>
                    <Plus size={14} />
                  </div>
                  <input {...getInputProps()} />
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
