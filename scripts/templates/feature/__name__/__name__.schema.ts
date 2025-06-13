import { z } from 'zod';

// TODO: 폼 검증을 위한 Zod 스키마 정의
export const __name__Schema = z.object({
  name: z.string().min(1, '__Name__ is required'),
});
