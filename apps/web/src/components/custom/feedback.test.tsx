import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { EmptyState } from '@/components/custom/Empty';
import { ErrorNotice } from '@/components/custom/Error';
import { LoadingState } from '@/components/custom/Loader';

describe('feedback components', () => {
  it('renders empty, error, and loading contracts', () => {
    render(
      <EmptyState
        title="아직 추가한 단어가 없습니다."
        description="발견한 단어를 지식으로 확장해 보세요."
        action={<button type="button">첫 단어 추가</button>}
      />,
    );

    expect(
      screen.getByRole('heading', { name: '아직 추가한 단어가 없습니다.' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '첫 단어 추가' })).toBeInTheDocument();

    render(
      <ErrorNotice
        title="단어를 확장하지 못했습니다."
        description="입력한 단어는 그대로 유지했습니다."
        action={<button type="button">다시 시도</button>}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('다시 시도');

    render(<LoadingState message="불러오는 중" description="잠시만 기다려 주세요." />);

    expect(screen.getByRole('status')).toHaveTextContent('불러오는 중');
  });
});
