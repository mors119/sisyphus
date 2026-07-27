import { beforeEach, describe, expect, it } from 'vitest';

import { useDndStore } from './editDnd.store';

describe('editDnd store', () => {
  beforeEach(() => {
    useDndStore.setState({ activeDrag: { kind: 'none' } });
  });

  it('starts with no active drag', () => {
    expect(useDndStore.getState().activeDrag).toEqual({ kind: 'none' });
  });

  it('tracks category drag as a single authoritative state', () => {
    const category = { id: 1, title: 'Study', color: '#336699' };

    useDndStore.getState().startCategoryDrag(category);

    expect(useDndStore.getState().activeDrag).toEqual({
      kind: 'category',
      category,
    });
  });

  it('tracks note drag without a separate boolean flag', () => {
    useDndStore.getState().startNoteDrag();

    expect(useDndStore.getState().activeDrag).toEqual({ kind: 'note' });
  });

  it('clears drag state after activeDone', () => {
    useDndStore.getState().startNoteDrag();
    useDndStore.getState().activeDone();

    expect(useDndStore.getState().activeDrag).toEqual({ kind: 'none' });
  });

  it('replaces category drag when note drag starts', () => {
    useDndStore.getState().startCategoryDrag({
      id: 1,
      title: 'Study',
      color: '#336699',
    });
    useDndStore.getState().startNoteDrag();

    expect(useDndStore.getState().activeDrag).toEqual({ kind: 'note' });
  });
});
