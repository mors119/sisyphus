import { fireEvent, render, screen, cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { KnowledgeCompletion } from './KnowledgeCompletion.container';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { word?: string }) => {
      if (key === 'knowledge.completion.description') {
        return `Saved ${options?.word ?? ''}`;
      }
      return key;
    },
  }),
}));

describe('KnowledgeCompletion', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders continuation actions and focuses the completion heading', () => {
    render(
      <KnowledgeCompletion
        createdNote={{ id: 1, title: 'hello' }}
        onAddAnother={vi.fn()}
        onViewCreated={vi.fn()}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'knowledge.completion.heading' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'knowledge.completion.actions.viewCreated',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'knowledge.completion.actions.addAnother',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('Saved hello')).toBeInTheDocument();
  });

  it('calls continuation handlers from the shared buttons', () => {
    const onAddAnother = vi.fn();
    const onViewCreated = vi.fn();

    render(
      <KnowledgeCompletion
        createdNote={{ id: 1, title: 'hello' }}
        onAddAnother={onAddAnother}
        onViewCreated={onViewCreated}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'knowledge.completion.actions.viewCreated',
      }),
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: 'knowledge.completion.actions.addAnother',
      }),
    );

    expect(onViewCreated).toHaveBeenCalledTimes(1);
    expect(onAddAnother).toHaveBeenCalledTimes(1);
  });
});
