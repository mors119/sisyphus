import { useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useImageDropzone } from '../view/useImageDropzone.hook';
import type { ImageResponse } from './image.type';

interface ImageUploaderProps {
  /** @description 선택된 파일을 저장하는 ref (역할: 폼 제출 시 업로드 파일 전달) */
  fileRef: React.RefObject<File | null>;

  /** @description 로컬 미리보기 ObjectURL (역할: 화면 표시) */
  previewUrl: string | null;
  setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>;

  /** @description 서버에 이미 저장되어 있는 이미지 목록(역할: 수정 화면) */
  imageInfo?: ImageResponse[];
  setImageInfo: React.Dispatch<
    React.SetStateAction<ImageResponse[] | undefined>
  >;

  /** @description UI 크기 모드 */
  variant?: 'compact' | 'full' | 'panel';
}

export function ImageUploaderForm({
  fileRef,
  previewUrl,
  setPreviewUrl,
  imageInfo,
  setImageInfo,
  variant = 'compact',
}: ImageUploaderProps) {
  const isPanel = variant === 'panel';
  const isFull = variant === 'full' || isPanel;
  const isEmptyImages = !imageInfo || imageInfo.length === 0;

  const { getRootProps, getInputProps, isDragActive } = useImageDropzone({
    setFile: (file: File) => {
      // 1) 업로드 대상은 ref에 저장
      fileRef.current = file;

      // 2) 프리뷰 URL 생성
      const next = URL.createObjectURL(file);
      setPreviewUrl(next);
    },
    setPreviewUrl,
  });

  const mediaClassName = cn(
    'relative overflow-hidden',
    isPanel
      ? 'aspect-[4/3] w-full max-w-md rounded-[var(--radius-role-card)] border border-border'
      : isFull
        ? 'h-80 w-80 rounded border'
        : 'h-16 w-16 rounded border',
  );

  const dropzoneClassName = cn(
    'flex cursor-pointer items-center justify-center border-2 border-dashed',
    isPanel
      ? 'aspect-[4/3] w-full max-w-md rounded-[var(--radius-role-card)] border-border bg-muted/40'
      : cn('rounded', isFull ? 'h-80 w-80' : 'h-16 w-20'),
    isDragActive
      ? 'border-brand-primary bg-brand-primary-subtle'
      : !isPanel && 'border-gray-300',
  );

  /**
   * @description 선택/프리뷰/기존 이미지 상태를 초기화
   */
  const clearSelection = () => {
    fileRef.current = null;
    setPreviewUrl(null);
    // “기존 이미지까지 삭제”는 별도 버튼에서만 하도록 권장
  };

  useEffect(() => {
    // previewUrl이 바뀌면 이전 objectURL 해제
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className={cn(isPanel ? 'w-full max-w-md' : 'flex items-center gap-2')}>
      {/* 1) 새로 선택된 프리뷰(기존 이미지가 없을 때만 보여주는 현재 정책 유지) */}
      {previewUrl && isEmptyImages && (
        <div className={mediaClassName}>
          <img
            src={previewUrl}
            alt="preview"
            className="h-full w-full object-cover"
          />

          <button
            type="button"
            onClick={clearSelection}
            className="absolute right-2 top-2 rounded bg-black/50 p-1 text-white">
            <X size={isPanel ? 16 : 14} />
          </button>
        </div>
      )}

      {/* 2) 기존 이미지들 */}
      {!previewUrl &&
        imageInfo?.map((item) => (
          <div key={item.id} className={mediaClassName}>
            <img
              src={item.url}
              alt={item.originName}
              className="h-full w-full object-cover"
            />

            {/* 여기서 “기존 이미지 제거”는 명시적 버튼으로 */}
            <button
              type="button"
              onClick={() => {
                // TODO: 실제 삭제 API가 있다면 여기서 호출 후 state 갱신
                setImageInfo(undefined);
              }}
              className="absolute right-2 top-2 rounded bg-black/50 p-1 text-white">
              <X size={isPanel ? 16 : 14} />
            </button>
          </div>
        ))}

      {/* 3) 업로드 입력(조건: 기존 이미지도 없고 프리뷰도 없을 때) */}
      {!previewUrl && isEmptyImages && (
        <div {...getRootProps()} className={dropzoneClassName}>
          <div
            className={cn(
              'flex items-center gap-2',
              isPanel ? 'text-sm text-muted-foreground' : 'gap-1 text-xs',
              isDragActive && 'text-info',
            )}>
            <span>{isPanel ? 'image' : 'image'}</span>
            <Plus size={isPanel ? 16 : 14} />
          </div>
          <input {...getInputProps()} />
        </div>
      )}
    </div>
  );
}
