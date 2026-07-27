const toBase64Url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

export const createPkce = async () => {
  const verifier = toBase64Url(crypto.getRandomValues(new Uint8Array(64)));
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(verifier),
  );

  return {
    verifier,
    challenge: toBase64Url(new Uint8Array(digest)),
  };
};

export const createExtensionAuthorizationUrl = (
  backendUrl: string,
  providerId: string,
  redirectUri: string,
  challenge: string,
) => {
  const authorizationUrl = new URL(`${backendUrl}/auth/${providerId}`);
  authorizationUrl.searchParams.set('mode', 'extension');
  authorizationUrl.searchParams.set('redirectedUri', redirectUri);
  authorizationUrl.searchParams.set('codeChallenge', challenge);
  authorizationUrl.searchParams.set('codeChallengeMethod', 'S256');
  return authorizationUrl.toString();
};
