import { describe, expect, it } from 'vitest';

import { parseWordInput } from './wordInput.schema';

describe('wordInput.schema', () => {
  it('rejects empty and whitespace-only input', () => {
    expect(parseWordInput('')).toEqual({ success: false, code: 'empty' });
    expect(parseWordInput('   ')).toEqual({ success: false, code: 'empty' });
  });

  it('trims surrounding whitespace before validation', () => {
    expect(parseWordInput('  hello  ')).toEqual({
      success: true,
      word: 'hello',
    });
  });

  it('rejects invalid characters and overly long words', () => {
    expect(parseWordInput('hello@world')).toEqual({
      success: false,
      code: 'invalid',
    });
    expect(parseWordInput('a'.repeat(101))).toEqual({
      success: false,
      code: 'invalid',
    });
  });

  it('accepts letters, numbers, spaces, apostrophes, and hyphens', () => {
    expect(parseWordInput("café-go")).toEqual({
      success: true,
      word: "café-go",
    });
    expect(parseWordInput('단어')).toEqual({ success: true, word: '단어' });
  });
});
