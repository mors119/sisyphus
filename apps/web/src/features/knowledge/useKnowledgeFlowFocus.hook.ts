import { useEffect, useRef } from 'react';

import { WordInputPhase } from './word.types';

export function useKnowledgeFlowFocus(phase: WordInputPhase) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const focusTarget =
      root.querySelector<HTMLElement>('[data-flow-focus="true"]') ??
      root.querySelector<HTMLElement>('h1, h2');

    if (!focusTarget) return;

    if (!focusTarget.hasAttribute('tabindex')) {
      focusTarget.tabIndex = -1;
    }

    focusTarget.focus();
  }, [phase]);

  return containerRef;
}
