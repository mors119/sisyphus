import { toast } from 'sonner';

export const useAlert = () => {
  const alertMessage = (
    title: string,
    options?: {
      description?: string;
      duration?: number;
      position?:
        | 'top-center'
        | 'top-right'
        | 'top-left'
        | 'bottom-center'
        | 'bottom-right'
        | 'bottom-left';
      type?: 'default' | 'success' | 'error' | 'warning';
    },
  ) => {
    toast(title, {
      description: options?.description,
      duration: options?.duration ?? 3000,
      position: options?.position ?? 'top-center',
      ...(options?.type === 'success' && { icon: '✅' }),
      ...(options?.type === 'error' && { icon: '❌' }),
      ...(options?.type === 'warning' && { icon: '⚠️' }),
    });
  };

  return { alertMessage };
};
