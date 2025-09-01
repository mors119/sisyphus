import { ImageIcon } from 'lucide-react';
import { ImageResponse } from './image.type';

interface ImageCardProps {
  item?: ImageResponse;
}

export const ImageCard = ({ item }: ImageCardProps) => {
  return (
    <div className="relative aspect-[4/3] bg-gray-100 dark:bg-neutral-800 overflow-hidden">
      {item ? (
        <img
          src={item.url}
          alt={item.originName}
          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
          <ImageIcon size={40} />
        </div>
      )}
    </div>
  );
};
