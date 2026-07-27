import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuthStore } from '@/features/auth/auth.store';
import { useUserHydration } from './useUserHydration.hook';

const mockUser = {
  id: 1,
  email: 'user@example.com',
  nickname: 'User',
};

vi.mock('./useUser.query', () => ({
  useUserQuery: vi.fn(),
}));

vi.mock('@/lib/react-query', () => ({
  clearQueryCache: vi.fn(),
}));

import { useUserQuery } from './useUser.query';

describe('useUserHydration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('localStorage', {
      removeItem: vi.fn(),
      setItem: vi.fn(),
      getItem: vi.fn(),
    });
    useAuthStore.setState({ accessToken: null, user: null });
  });

  it('derives the resolved user from query data or the auth store', () => {
    vi.mocked(useUserQuery).mockReturnValue({
      data: mockUser,
      isLoading: false,
    } as unknown as ReturnType<typeof useUserQuery>);

    useAuthStore.setState({ accessToken: 'token', user: null });

    const { result } = renderHook(() => useUserHydration());

    expect(result.current.user).toEqual(mockUser);
  });

  it('clears stale query data when the access token is missing', () => {
    vi.mocked(useUserQuery).mockReturnValue({
      data: mockUser,
      isLoading: false,
    } as unknown as ReturnType<typeof useUserQuery>);

    renderHook(() => useUserHydration());

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().accessToken).toBeNull();
  });

  it('hydrates the auth store once when query data arrives', () => {
    vi.mocked(useUserQuery).mockReturnValue({
      data: mockUser,
      isLoading: false,
    } as unknown as ReturnType<typeof useUserQuery>);

    useAuthStore.setState({ accessToken: 'token', user: null });

    renderHook(() => useUserHydration());

    expect(useAuthStore.getState().user).toEqual(mockUser);
  });
});
