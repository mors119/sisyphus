import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { WordInput } from './WordInput.container';
import { useWordInput } from './useWordInput.hook';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const labels: Record<string, string> = {
        'knowledge.input.prompt': '오늘 어떤 단어를 발견했나요?',
        'knowledge.input.label': '단어',
        'knowledge.input.placeholder': '단어를 입력하세요',
        'knowledge.input.actions.expand': '확장하기',
        'knowledge.input.actions.expanding': '확장 중',
        'knowledge.input.errors.empty': '단어를 입력해 주세요.',
      };
      return labels[key] ?? key;
    },
  }),
}));

const submitWordForExpansion = vi.fn();

vi.mock('./word.api', () => ({
  submitWordForExpansion: (...args: unknown[]) => submitWordForExpansion(...args),
}));

function WordInputHarness() {
  const workspace = useWordInput();
  return <WordInput workspace={workspace} />;
}

describe('WordInput', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    submitWordForExpansion.mockResolvedValue(undefined);
  });

  it('submits through the primary button and Enter with the same validation path', async () => {
    render(<WordInputHarness />);

    const input = screen.getByPlaceholderText('단어를 입력하세요');

    fireEvent.change(input, { target: { value: 'hello' } });
    fireEvent.click(screen.getByRole('button', { name: '확장하기' }));

    expect(submitWordForExpansion).toHaveBeenCalledWith('hello');

    cleanup();
    submitWordForExpansion.mockClear();

    render(<WordInputHarness />);
    const enterInput = screen.getByPlaceholderText('단어를 입력하세요');
    fireEvent.change(enterInput, { target: { value: 'world' } });
    fireEvent.submit(enterInput.closest('form')!);

    expect(submitWordForExpansion).toHaveBeenCalledWith('world');
  });

  it('announces empty validation clearly', async () => {
    render(<WordInputHarness />);

    fireEvent.click(screen.getByRole('button', { name: '확장하기' }));

    expect(await screen.findByText('단어를 입력해 주세요.')).toBeInTheDocument();
    expect(submitWordForExpansion).not.toHaveBeenCalled();
  });

  it('disables duplicate submission while validating', async () => {
    let resolveSubmit: (() => void) | undefined;
    submitWordForExpansion.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmit = resolve;
        }),
    );

    render(<WordInputHarness />);

    fireEvent.change(screen.getByPlaceholderText('단어를 입력하세요'), {
      target: { value: 'hello' },
    });

    fireEvent.click(screen.getByRole('button', { name: '확장하기' }));

    expect(screen.getByRole('button', { name: '확장 중' })).toBeDisabled();

    resolveSubmit?.();
  });
});
