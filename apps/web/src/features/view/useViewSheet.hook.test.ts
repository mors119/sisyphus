import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useNoteStore } from './note.store';
import { useViewSheet } from './useViewSheet.hook';

const sampleNote = {
  id: 42,
  title: 'Sample',
  subTitle: 'Sub',
  description: 'Desc',
  tags: [],
  createdAt: '2026-01-01',
  category: { id: 1, title: 'Study', color: '#336699' },
  image: [],
};

describe('useViewSheet', () => {
  beforeEach(() => {
    useNoteStore.getState().resetEditNote();
  });

  it('starts closed with no selected note', () => {
    const { result } = renderHook(() => useViewSheet());

    expect(result.current.mode).toBe('closed');
    expect(result.current.isOpen).toBe(false);
    expect(result.current.editNote.id).toBe(0);
  });

  it('opens detail view with one authoritative note owner', () => {
    const { result } = renderHook(() => useViewSheet());

    act(() => {
      result.current.openDetail(sampleNote);
    });

    expect(result.current.mode).toBe('detail');
    expect(result.current.isOpen).toBe(true);
    expect(result.current.editNote).toEqual(sampleNote);
  });

  it('transitions from detail to edit without duplicating open flags', () => {
    const { result } = renderHook(() => useViewSheet());

    act(() => {
      result.current.openDetail(sampleNote);
      result.current.openEdit();
    });

    expect(result.current.mode).toBe('edit');
    expect(result.current.editNote.id).toBe(42);
  });

  it('closes the sheet and resets the shared note store', () => {
    const { result } = renderHook(() => useViewSheet());

    act(() => {
      result.current.openDetail(sampleNote);
      result.current.close();
    });

    expect(result.current.mode).toBe('closed');
    expect(result.current.isOpen).toBe(false);
    expect(useNoteStore.getState().editNote.id).toBe(0);
  });
});
