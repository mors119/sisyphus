import api from '@/services/route';
import imageCompression from 'browser-image-compression';
import type { UploadImageResponse } from './image.type';

const compress = (file: File) =>
  imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1280,
    useWebWorker: true,
  });

/** 이미지 업로드 */
export const uploadImage = async (file: File): Promise<UploadImageResponse> => {
  if (!file || !file.type.startsWith('image/')) {
    throw new Error('이미지 파일만 업로드할 수 있습니다.');
  }

  const compressedBlob = await compress(file);
  const compressedFile = new File([compressedBlob], file.name, {
    type: compressedBlob.type,
  });

  const formData = new FormData();
  formData.append('file', compressedFile); // 서버 @RequestParam("file") 기준

  // Content-Type은 넣지 않음(브라우저가 boundary 포함해 자동 설정)
  const { data } = await api.post<UploadImageResponse>('/image', formData);
  return data;
};

/** 이미지 교체(수정) */
export const updateImage = async (
  file: File,
  id: number | undefined,
): Promise<UploadImageResponse> => {
  if (!id) throw new Error('이미지 ID가 필요합니다.');
  if (!file || !file.type.startsWith('image/')) {
    throw new Error('이미지 파일만 업로드할 수 있습니다.');
  }

  const compressedBlob = await compress(file);
  const compressedFile = new File([compressedBlob], file.name, {
    type: compressedBlob.type,
  });

  const formData = new FormData();
  formData.append('file', compressedFile);

  // Content-Type 헤더 지정 X
  const { data } = await api.put<UploadImageResponse>(`/image/${id}`, formData);
  return data;
};
