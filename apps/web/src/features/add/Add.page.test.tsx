import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import AddPage from './Add.page';
import { translateKnowledgeTestLabel } from '../knowledge/knowledge.test-labels';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, string>) =>
      translateKnowledgeTestLabel(key, options),
  }),
}));

const submitWordForExpansion = vi.fn();
const mutateAsync = vi.fn();

vi.mock('../knowledge/word.api', () => ({
  submitWordForExpansion: (...args: unknown[]) => submitWordForExpansion(...args),
}));

vi.mock('../view/useView.mutation', () => ({
  useCreateNoteMutation: () => ({
    mutateAsync,
    isPending: false,
  }),
}));

vi.mock('@/lib/react-query', () => ({
  invalidateQuery: vi.fn().mockResolvedValue(undefined),
}));

const navigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom',
  );
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

function renderAddPage() {
  return render(
    <MemoryRouter initialEntries={['/add']}>
      <AddPage />
    </MemoryRouter>,
  );
}

async function submitWord(word: string) {
  fireEvent.change(screen.getByPlaceholderText('단어를 입력하세요'), {
    target: { value: word },
  });
  fireEvent.click(screen.getByRole('button', { name: '확장하기' }));
}

async function runExpansionTimers() {
  await act(async () => {
    await vi.runAllTimersAsync();
  });
}

async function advanceToReview() {
  await act(async () => {
    await vi.runAllTimersAsync();
  });
  await act(async () => {
    await Promise.resolve();
  });
}

async function editDefinitions(nextValue: string) {
  const definitionsHeading = screen.getByText('정의');
  const definitionsCard = definitionsHeading.closest('[data-slot="card"]') as HTMLElement;
  expect(definitionsCard).toBeTruthy();

  await act(async () => {
    fireEvent.click(within(definitionsCard!).getByRole('button', { name: '수정' }));
  });

  const textarea = within(definitionsCard!).getByRole('textbox');
  await act(async () => {
    fireEvent.change(textarea, { target: { value: nextValue } });
    fireEvent.click(
      within(definitionsCard!).getByRole('button', { name: '수정 적용' }),
    );
  });
}

async function saveReviewedKnowledge() {
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: '지식에 추가' }));
  });
  await act(async () => {
    await Promise.resolve();
  });
}

describe('AddPage knowledge journey', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    submitWordForExpansion.mockResolvedValue(undefined);
    mutateAsync.mockResolvedValue(99);
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('completes input → expansion → review → edit → save → completion', async () => {
    renderAddPage();

    await act(async () => {
      await submitWord('hello');
    });

    expect(submitWordForExpansion).toHaveBeenCalledWith('hello');
    expect(screen.getByText('단어를 확장하는 중')).toBeInTheDocument();

    await advanceToReview();

    expect(
      screen.getByRole('heading', { name: '생성된 지식 검토' }),
    ).toBeInTheDocument();

    await editDefinitions('edited definition for hello');
    await saveReviewedKnowledge();

    expect(mutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'hello',
        description: expect.stringContaining('edited definition for hello'),
      }),
    );

    expect(
      screen.getByRole('heading', { name: '지식에 추가했습니다' }),
    ).toHaveFocus();
    expect(
      screen.getByRole('button', { name: '새 단어 추가' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '추가한 지식 보기' }),
    ).toBeInTheDocument();
  });

  it('continues after an optional image failure, preserves edits, and saves', async () => {
    renderAddPage();

    await act(async () => {
      await submitWord('fail-image');
    });

    await runExpansionTimers();

    expect(screen.getByText('단어를 확장하는 중')).toBeInTheDocument();
    expect(screen.getByText('이미지를 찾지 못했습니다.')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: '계속하기' }));
    });
    await advanceToReview();

    expect(
      screen.getByRole('heading', { name: '생성된 지식 검토' }),
    ).toBeInTheDocument();

    await editDefinitions('definition kept after image failure');
    await saveReviewedKnowledge();

    expect(mutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'fail-image',
        description: expect.stringContaining('definition kept after image failure'),
      }),
    );

    expect(
      screen.getByRole('heading', { name: '지식에 추가했습니다' }),
    ).toBeInTheDocument();
  });

  it('keeps primary actions keyboard accessible across lifecycle sections', async () => {
    renderAddPage();

    const expandButton = screen.getByRole('button', { name: '확장하기' });
    expandButton.focus();
    expect(expandButton).toHaveFocus();

    await act(async () => {
      await submitWord('hello');
    });
    await advanceToReview();

    const saveButton = screen.getByRole('button', {
      name: '지식에 추가',
    });
    saveButton.focus();
    expect(saveButton).toHaveFocus();
  });
});

describe('AddPage responsive layout', () => {
  it('avoids horizontal overflow and keeps mobile-safe spacing on the flow shell', () => {
    renderAddPage();

    const layout = document.querySelector('[data-knowledge-flow="true"]');
    expect(layout).toHaveClass('overflow-x-hidden');
    expect(layout).toHaveClass('max-md:min-h-[100dvh]');
  });
});
