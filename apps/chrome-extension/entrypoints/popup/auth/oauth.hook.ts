import { BACK_URL, REDIRECT_URL } from './auth.constants';
import { useAuthStore } from './auth.store';
import { exchangeExtensionCodeApi } from './auth.api';
import {
  createExtensionAuthorizationUrl,
  createPkce,
} from './pkce.utils';

export const useOAuthHook = () => {
  const { setAccessToken, clear } = useAuthStore();
  const handleLogin = async (providerId: string) => {
    clear();
    const { verifier, challenge } = await createPkce();
    const authorizationUrl = createExtensionAuthorizationUrl(
      BACK_URL,
      providerId,
      REDIRECT_URL,
      challenge,
    );

    chrome.identity.launchWebAuthFlow(
      {
        url: authorizationUrl,
        interactive: true,
      },
      async function (redirectedUrl) {
        if (chrome.runtime.lastError || !redirectedUrl) {
          clear();
          console.error('OAuth failed');
          return;
        }

        try {
          const url = new URL(redirectedUrl);
          const code = url.searchParams.get('code');

          if (!code || url.searchParams.has('error')) {
            throw new Error('OAuth callback did not contain an authorization code');
          }

          const { accessToken } = await exchangeExtensionCodeApi({
            code,
            codeVerifier: verifier,
            redirectUri: REDIRECT_URL,
          });
          setAccessToken(accessToken);
        } catch {
          clear();
          console.error('OAuth code exchange failed');
        }
      },
    );
  };

  return { handleLogin };
};
