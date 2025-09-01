import { useEffect } from 'react';
import { useImageDropzone } from '../view/useImageDropzone.hook';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ImageResponse } from './image.type';
import { useLocation } from 'react-router-dom';

// TODO: 이미지 업로드 -> 노트 업로드 구현 multipart/formdata

interface ImageUploaderProps {
  fileRef: React.RefObject<File | null>;
  previewUrl: string | null;
  setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>;
  imageInfo?: ImageResponse[];
  setImageInfo: React.Dispatch<
    React.SetStateAction<ImageResponse[] | undefined>
  >;
}

export function ImageUploaderForm({
  fileRef,
  setPreviewUrl,
  previewUrl,
  imageInfo,
  setImageInfo,
}: ImageUploaderProps) {
  const location = useLocation();

  // Dropzone props 생성
  const { getRootProps, getInputProps, isDragActive } = useImageDropzone({
    setFile: (file) => {
      fileRef.current = file;
      setPreviewUrl(URL.createObjectURL(file));
    },
    setPreviewUrl,
  });

  useEffect(() => {
    // previewUrl이 변경될 때 이전 URL을 해제하지 않으면 메모리 누수 발생
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const isEmptyImages = !imageInfo || imageInfo.length === 0;

  return (
    <div className="flex">
      {previewUrl && isEmptyImages ? (
        <div
          className={cn(
            'max-w-16 max-h-16',
            location.pathname === '/add' && 'max-w-80 max-h-80',
          )}>
          <button
            type="button"
            onClick={() => {
              fileRef.current = null;
              setPreviewUrl(null);
            }}>
            <img
              src={previewUrl}
              alt="preview"
              className="mt-2 w-full h-full mx-auto"
            />
          </button>
        </div>
      ) : (
        imageInfo?.map((item) => (
          <div
            className={cn(
              'max-w-16 max-h-16',
              location.pathname === '/add' && 'max-w-full max-h-full',
            )}
            key={item.id}>
            <button
              type="button"
              onClick={() => {
                fileRef.current = null;
                setPreviewUrl(null);
                setImageInfo(undefined);
              }}>
              <img
                src={'/api' + item.url}
                alt={item.originName}
                className="mt-2 w-full h-full mx-auto"
              />
            </button>
          </div>
        ))
      )}

      {!fileRef.current && isEmptyImages && (
        <div
          {...getRootProps()}
          className={cn(
            `border-2 p-2 border-dashed rounded flex cursor-pointer w-20 max-h-16 justify-center items-center`,
            isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300',
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
  );
}
