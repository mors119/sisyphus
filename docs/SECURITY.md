# Security Policy

## Supported Versions

Only the latest main branch is actively supported.

## Reporting a Vulnerability

Please do not open public issues for security vulnerabilities.

Instead, contact the maintainers privately.

Email:
security@example.com

Include:

- Description
- Impact
- Steps to reproduce
- Suggested mitigation

We will acknowledge reports within 7 days.

## Scope

Examples of security issues:

- Authentication bypass
- Authorization issues
- JWT vulnerabilities
- OAuth vulnerabilities
- Sensitive information exposure
- Remote code execution
- SQL injection
- XSS
- CSRF

## Authentication Session Flows

### Web

OAuth success sets the refresh token only in an `HttpOnly` cookie and redirects
to `/oauth/success` without credential query parameters. Before rendering routes,
the web app calls `POST /api/auth/refresh` with credentials. The returned
short-lived access token is held only in the in-memory auth store.

Reloading the page repeats this cookie-backed bootstrap. Logout, refresh
failure, and authentication failure clear the in-memory state and remove legacy
`accessToken` and `auth-storage` browser storage entries.

Refresh cookies use the configured `Secure`, `SameSite`, `Domain`, `Path=/`, and
`Max-Age` attributes. Production defaults to `Secure` and `SameSite=None`;
deployments should use the narrowest `Domain` and `SameSite` values supported by
their web/API topology.

The refresh endpoint mints an access token but does not perform an application
state change. Cross-origin reads are restricted to the configured credentialed
CORS origins. Application mutations continue to require the bearer access token,
so the refresh cookie is not accepted as authorization for them.

### Chrome extension

The extension generates an S256 PKCE verifier and challenge in memory before
starting OAuth. After provider authentication, the backend redirects only a
random authorization code to the registered
`https://<extension-id>.chromiumapp.org` callback. The extension exchanges the
code, verifier, and same redirect URI at `POST /api/auth/extension/token`.

Authorization codes expire after 60 seconds, are atomically consumed from Redis,
are bound to the redirect URI and PKCE challenge, and cannot be replayed. The
resulting access token remains in popup runtime memory. Closing or restarting
the popup requires a new login; durable token persistence is intentionally not
used. Password-based extension login uses the dedicated
`POST /api/auth/extension/login` endpoint, which likewise returns an access
token without issuing a refresh-token cookie.

On popup startup, logout, or authentication failure, legacy `accessToken` and
`auth-storage` entries are deleted from both extension and page-local storage.
Neither bearer tokens nor verifier values should be logged.

## Disclosure Policy

Please allow maintainers time to investigate and patch vulnerabilities before public disclosure.
