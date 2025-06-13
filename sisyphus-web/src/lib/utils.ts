import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// shadcn 관련 기본 util
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
