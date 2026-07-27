import axios from 'axios';
import {
  clearLegacyAuthStorage,
  useAuthStore,
} from '@/features/auth/auth.store';

let bootstrapPromise: Promise<void> | null = null;

export const stripLegacyCredentialParams = () => {
  const url = new URL(window.location.href);
  const credentialParams = ['token', 'access_token', 'refresh_token'];
  const hadCredentialParam = credentialParams.some((name) =>
    url.searchParams.has(name),
  );

  if (!hadCredentialParam) {
    return;
  }

  credentialParams.forEach((name) => url.searchParams.delete(name));
  window.history.replaceState(
    window.history.state,
    '',
    `${url.pathname}${url.search}${url.hash}`,
  );
};

export const bootstrapAuthSession = () => {
  if (bootstrapPromise) {
    return bootstrapPromise;
  }

  clearLegacyAuthStorage();
  bootstrapPromise = axios
    .post<{ accessToken: string }>('/api/auth/refresh', null, {
      withCredentials: true,
    })
    .then(({ data }) => {
      if (!data.accessToken) {
        throw new Error('Session bootstrap did not return an access token');
      }
      useAuthStore.getState().setAccessToken(data.accessToken);
    })
    .catch(() => {
      useAuthStore.getState().setUnauthenticated();
    });

  return bootstrapPromise;
};
