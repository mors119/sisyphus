import { useDropzone } from 'react-dropzone';

export function useImageDropzone({
  setFile,
  setPreviewUrl,
}: {
  setFile: (file: File) => void;
  setPreviewUrl: (url: string) => void;
}) {
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });
}
