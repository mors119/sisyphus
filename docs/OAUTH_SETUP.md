# OAUTH_SETUP.md

# OAuth Setup

Sisyphus Academy supports:

- Google Login
- Naver Login
- Kakao Login

OAuth credentials must never be committed.

Store them only in local or deployment environment files.

---

# Google

Create an OAuth application.

Required variables:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Redirect URI:

```text
http://localhost/login/oauth2/code/google
```

Production:

```text
https://your-domain.com/login/oauth2/code/google
```

---

# Naver

Required variables:

```env
NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=
```

Redirect URI:

```text
http://localhost/login/oauth2/code/naver
```

---

# Kakao

Required variables:

```env
KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=
```

Redirect URI:

```text
http://localhost/login/oauth2/code/kakao
```

---

# Security Notes

Do not:

- Commit OAuth credentials
- Share OAuth credentials publicly
- Store OAuth credentials in source code

Always use environment variables.

## Chrome Extension OAuth

Set `APP_EXTENSION_HOST` to the installed extension origin:

```env
APP_EXTENSION_HOST=chrome-extension://<extension-id>
```

The backend derives and exclusively permits the matching
`https://<extension-id>.chromiumapp.org` identity callback. Extension OAuth uses
a 60-second, single-use authorization code and S256 PKCE; bearer tokens are
never returned in redirect URLs.
