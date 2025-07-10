import { BACK_URL, REDIRECT_URL } from './auth.constants';
import { useAuthStore } from './auth.store';

export const useOAuthHook = () => {
  const { setAccessToken } = useAuthStore();
  const handleLogin = (providerId: string) => {
    console.log(REDIRECT_URL);
    chrome.identity.launchWebAuthFlow(
      {
        // 이 URL은 백엔드에서 /oauth2/authorization/{provider}로 redirect되며,
        // Spring Security의 onAuthenticationSuccess 핸들러에서 토큰 포함하여 리디렉션할 것
        url: `${BACK_URL}/auth/${providerId}?mode=extension&redirectedUri=${REDIRECT_URL}`,
        interactive: true,
      },
      function (redirectedUrl) {
        console.log(chrome.runtime.lastError);
        console.log(redirectedUrl);
        if (chrome.runtime.lastError || !redirectedUrl) {
          console.error('OAuth 실패:', chrome.runtime.lastError);
          return;
        }

        try {
          const url = new URL(redirectedUrl);
          const accessToken = url.searchParams.get('token');

          if (accessToken) {
            console.log('받은 accessToken:', accessToken);
            setAccessToken(accessToken);
          } else {
            console.error('토큰이 없습니다. URL:', redirectedUrl);
          }
        } catch (e) {
          console.error('URL 파싱 실패:', e);
        }
      },
    );
  };

  return { handleLogin };
};
