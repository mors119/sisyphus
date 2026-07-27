import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '@/components/ui/button';
import { KnowledgeCompletion } from './KnowledgeCompletion.container';
import { translateKnowledgeTestLabel } from './knowledge.test-labels';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, string>) =>
      translateKnowledgeTestLabel(key, options),
  }),
}));

describe('knowledge brand consistency', () => {
  it('uses the shared primary button variant for dominant knowledge actions', () => {
    render(
      <>
        <Button variant="primary">확장하기</Button>
        <Button variant="primary">지식에 추가</Button>
        <KnowledgeCompletion
          createdNote={{ id: 1, title: 'hello' }}
          onAddAnother={vi.fn()}
          onViewCreated={vi.fn()}
        />
      </>,
    );

    const primaryButtons = screen
      .getAllByRole('button')
      .filter((button) => button.className.includes('bg-action-primary'));

    expect(primaryButtons.map((button) => button.textContent)).toEqual([
      '확장하기',
      '지식에 추가',
      '새 단어 추가',
    ]);
  });
});
