import { z } from 'zod';

const WORD_PATTERN = /^[\p{L}\p{N}\s'-]+$/u;

export const wordInputSchema = z
  .string()
  .transform((value) => value.trim())
  .superRefine((value, ctx) => {
    if (value.length === 0) {
      ctx.addIssue({ code: 'custom', message: 'empty' });
      return;
    }

    if (value.length > 100) {
      ctx.addIssue({ code: 'custom', message: 'invalid' });
      return;
    }

    if (!WORD_PATTERN.test(value)) {
      ctx.addIssue({ code: 'custom', message: 'invalid' });
    }
  });

export type WordInputValidationCode = 'empty' | 'invalid';

export const parseWordInput = (
  value: string,
): { success: true; word: string } | { success: false; code: WordInputValidationCode } => {
  const result = wordInputSchema.safeParse(value);

  if (result.success) {
    return { success: true, word: result.data };
  }

  const code = result.error.issues[0]?.message;
  if (code === 'empty' || code === 'invalid') {
    return { success: false, code };
  }

  return { success: false, code: 'invalid' };
};
