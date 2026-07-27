import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HashTagInput } from './HashTagInput.container';

const mockTags = [
  { id: 1, name: 'react' },
  { id: 2, name: 'typescript' },
];

vi.mock('./useTag.query', () => ({
  useFetchTags: () => ({
    data: mockTags,
  }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('HashTagInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('uses React Query tags directly without a mirrored store', () => {
    const onChange = vi.fn();

    render(<HashTagInput value={[]} onChange={onChange} />);

    fireEvent.change(screen.getByPlaceholderText('tags.placeholder'), {
      target: { value: 'rea' },
    });
    fireEvent.click(screen.getByText('# react'));

    expect(onChange).toHaveBeenCalledWith([{ id: 1, name: 'react' }]);
  });

  it('creates a local draft tag when no suggestion matches', () => {
    const onChange = vi.fn();

    render(<HashTagInput value={[]} onChange={onChange} />);

    const input = screen.getByPlaceholderText('tags.placeholder');
    fireEvent.change(input, { target: { value: 'newtag' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onChange).toHaveBeenCalledWith([
      expect.objectContaining({ name: 'newtag' }),
    ]);
  });
});
