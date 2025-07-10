import { z } from 'zod';

export const requireSchema = () => {
  return z.object({
    title: z.string().min(1, { message: '' }),
    description: z.string(),
  });
};
