import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useKnowledgeFlowFocus } from './useKnowledgeFlowFocus.hook';
import { WordInputPhase } from './word.types';

describe('useKnowledgeFlowFocus', () => {
  it('returns a container ref for lifecycle focus management', () => {
    const { result, rerender } = renderHook(
      ({ phase }: { phase: WordInputPhase }) => useKnowledgeFlowFocus(phase),
      { initialProps: { phase: 'idle' } },
    );

    expect(result.current.current).toBeNull();

    act(() => {
      const container = document.createElement('div');
      const heading = document.createElement('h1');
      heading.textContent = 'Flow heading';
      container.appendChild(heading);
      document.body.appendChild(container);
      result.current.current = container;
    });

    act(() => {
      rerender({ phase: 'reviewing' });
    });

    expect(document.querySelector('h1')).toHaveFocus();

    document.body.innerHTML = '';
  });
});
