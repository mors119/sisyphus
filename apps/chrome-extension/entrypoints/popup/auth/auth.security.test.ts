import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearLegacyAuthStorage,
  useAuthStore,
} from './auth.store';
import {
  createExtensionAuthorizationUrl,
  createPkce,
} from './pkce.utils';

const removeExtensionStorage = vi.fn();
const removeLocalStorage = vi.fn();

beforeEach(() => {
  removeExtensionStorage.mockClear();
  removeLocalStorage.mockClear();
  vi.stubGlobal('chrome', {
    storage: {
      local: {
        remove: removeExtensionStorage,
      },
    },
  });
  vi.stubGlobal('localStorage', {
    removeItem: removeLocalStorage,
  });
  useAuthStore.setState({ accessToken: null });
});

describe('extension authentication security', () => {
  it('keeps access tokens in runtime memory only', () => {
    useAuthStore.getState().setAccessToken('runtime-token');

    expect(useAuthStore.getState().accessToken).toBe('runtime-token');
    expect(removeExtensionStorage).not.toHaveBeenCalled();
    expect(removeLocalStorage).not.toHaveBeenCalled();
  });

  it('removes legacy durable token entries', () => {
    clearLegacyAuthStorage();

    expect(removeLocalStorage).toHaveBeenCalledWith('auth-storage');
    expect(removeLocalStorage).toHaveBeenCalledWith('accessToken');
    expect(removeExtensionStorage).toHaveBeenCalledWith([
      'accessToken',
      'auth-storage',
    ]);
  });

  it('starts OAuth with S256 PKCE and no bearer credential', async () => {
    const { verifier, challenge } = await createPkce();
    const url = new URL(
      createExtensionAuthorizationUrl(
        'https://api.example.com/api',
        'google',
        'https://extension.chromiumapp.org',
        challenge,
      ),
    );

    expect(verifier).toMatch(/^[A-Za-z0-9_-]{43,128}$/);
    expect(challenge).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(url.searchParams.get('codeChallengeMethod')).toBe('S256');
    expect(url.searchParams.get('codeChallenge')).toBe(challenge);
    expect(url.searchParams.has('token')).toBe(false);
    expect(url.searchParams.has('access_token')).toBe(false);
  });
});
