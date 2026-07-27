import { beforeEach, describe, expect, it, vi } from 'vitest';

const removeItem = vi.fn();
const setItem = vi.fn();

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  vi.stubGlobal('localStorage', {
    removeItem,
    setItem,
  });
});

describe('web authentication security', () => {
  it('removes legacy credential parameters without trusting them', async () => {
    const replaceState = vi.fn();
    vi.stubGlobal('window', {
      location: {
        href: 'https://app.example.com/oauth/success?token=legacy&error=oauth_failed',
      },
      history: {
        state: null,
        replaceState,
      },
    });
    const { stripLegacyCredentialParams } = await import('./auth.session');

    stripLegacyCredentialParams();

    expect(replaceState).toHaveBeenCalledWith(
      null,
      '',
      '/oauth/success?error=oauth_failed',
    );
  });

  it('keeps a bootstrapped access token in memory only', async () => {
    vi.doMock('axios', () => ({
      default: {
        post: vi.fn().mockResolvedValue({
          data: { accessToken: 'memory-token' },
        }),
      },
    }));
    const { bootstrapAuthSession } = await import('./auth.session');
    const { useAuthStore } = await import('./auth.store');

    await bootstrapAuthSession();

    expect(useAuthStore.getState().accessToken).toBe('memory-token');
    expect(useAuthStore.getState().status).toBe('authenticated');
    expect(setItem).not.toHaveBeenCalled();
    expect(removeItem).toHaveBeenCalledWith('auth-storage');
    expect(removeItem).toHaveBeenCalledWith('accessToken');
  });

  it('clears authentication when session bootstrap fails', async () => {
    vi.doMock('axios', () => ({
      default: {
        post: vi.fn().mockRejectedValue(new Error('unauthorized')),
      },
    }));
    const { bootstrapAuthSession } = await import('./auth.session');
    const { useAuthStore } = await import('./auth.store');

    await bootstrapAuthSession();

    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(useAuthStore.getState().status).toBe('unauthenticated');
  });
});
