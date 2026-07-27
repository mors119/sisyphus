import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ProgressList } from '@/components/ui/progress-list';

describe('ProgressList', () => {
  it('exposes step text and current step semantics', () => {
    render(
      <ProgressList
        label="Expansion progress"
        items={[
          { id: '1', title: 'Analyze word', state: 'completed' },
          { id: '2', title: 'Generate fields', state: 'active' },
          { id: '3', title: 'Review', state: 'pending' },
        ]}
      />,
    );

    expect(screen.getByText('Analyze word')).toBeInTheDocument();
    expect(screen.getByText('Generate fields')).toBeInTheDocument();
    expect(
      screen.getByRole('list', { name: 'Expansion progress' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('listitem', { current: 'step' })).toHaveTextContent(
      'Generate fields',
    );
  });
});
