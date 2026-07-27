import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders primary, loading, and disabled states', () => {
    const { rerender } = render(<Button variant="primary">확장하기</Button>);

    expect(screen.getByRole('button', { name: '확장하기' })).toBeEnabled();

    rerender(
      <Button variant="primary" loading loadingLabel="확장 중">
        확장하기
      </Button>,
    );

    const loadingButton = screen.getByRole('button', { name: '확장 중' });
    expect(loadingButton).toBeDisabled();
    expect(loadingButton).toHaveAttribute('aria-busy', 'true');

    rerender(
      <Button variant="danger" disabled>
        삭제
      </Button>,
    );

    expect(screen.getByRole('button', { name: '삭제' })).toBeDisabled();
  });
});
