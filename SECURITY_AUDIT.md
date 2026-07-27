# Security Audit

## Scope

This audit reviewed the repository for open-source release readiness, with focus on:

- hardcoded secrets and credentials
- deployment-specific or private URLs and identifiers
- local/generated files that should not be committed
- missing environment-variable extraction

## Summary

No committed API keys, passwords, or OAuth client secrets were found in tracked application source files.

The main release blockers were:

- deployment-specific values hardcoded in Compose files
- personal/private identifiers embedded in repo content
- incomplete `.env.example` coverage
- missing `.gitignore` coverage for generated and local-only files that are present in the workspace

## Findings

| File                                                                           |       Line | Detected issue                                                                                  | Recommended fix                                                                                     |
| ------------------------------------------------------------------------------ | ---------: | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `docker-compose.yml`                                                           |         16 | Postgres healthcheck hardcoded database/user names.                                             | Use container environment variables in the healthcheck command.                                     |
| `docker-compose.yml`                                                           |      50-58 | Database and Redis connection settings partially hardcoded.                                     | Source `DB_URL`, `DB_USER`, `REDIS_HOST`, `REDIS_PORT`, and `REDIS_SSL` from environment variables. |
| `docker-compose.yml`                                                           |      61-70 | SMTP host/port and Chrome extension origin were hardcoded.                                      | Source `MAIL_HOST`, `MAIL_PORT`, and `APP_EXTENSION_HOST` from environment variables.               |
| `docker-compose.yml`                                                           |         75 | `IMAGE_PUBLIC_BASE` was assembled from a partially hardcoded path convention.                   | Provide the full public image base URL through environment configuration.                           |
| `docker-compose.prod.yml`                                                      |      10-12 | Postgres database/user names were hardcoded in production Compose.                              | Move them to `POSTGRES_DB` and `POSTGRES_USER` environment variables.                               |
| `docker-compose.prod.yml`                                                      |         16 | Postgres healthcheck hardcoded database/user names.                                             | Use container environment variables in the healthcheck command.                                     |
| `docker-compose.prod.yml`                                                      |         36 | Backend image pointed at a personal image namespace.                                            | Use a configurable image reference such as `BACKEND_IMAGE`.                                         |
| `docker-compose.prod.yml`                                                      |      48-57 | Database/Redis configuration partially hardcoded.                                               | Source them entirely from environment variables.                                                    |
| `docker-compose.prod.yml`                                                      |      59-67 | SMTP host/port and API/image host derivations were hardcoded.                                   | Source them from explicit environment variables.                                                    |
| `docker-compose.prod.yml`                                                      |         76 | `IMAGE_PUBLIC_BASE` was derived from `APP_HOST`.                                                | Use a dedicated environment variable for the public image base URL.                                 |
| `docker-compose.prod.yml`                                                      |      78-82 | Kakao secret variable support was incomplete in Compose.                                        | Add `KAKAO_CLIENT_SECRET` passthrough so secrets stay in environment only.                          |
| `docker-compose.prod.yml`                                                      | 91,101-102 | Web and Nginx images pointed at a personal image namespace and fixed platform.                  | Use configurable `WEB_IMAGE`, `NGINX_IMAGE`, and `NGINX_PLATFORM` variables.                        |
| `apps/api/src/main/resources/application-prod.properties`                      |         46 | Mail sender name was hardcoded.                                                                 | Allow override via `MAIL_FROM_NAME` environment variable.                                           |
| `apps/api/src/main/java/com/sisyphus/backend/global/config/OpenApiConfig.java` |         21 | OpenAPI server URL was hardcoded to localhost.                                                  | Read the public API URL from application configuration.                                             |
| `apps/web/public/locales/en/policy.md`                                         |         10 | Personal contact email was committed in public-facing policy content.                           | Replace with a public support/privacy alias before release.                                         |
| `apps/web/public/locales/ko/policy.md`                                         |         10 | Personal contact email was committed in public-facing policy content.                           | Replace with a public support/privacy alias before release.                                         |
| `.env.example`                                                                 |        1-7 | Example env file did not cover the actual runtime variables used by Compose and the apps.       | Expand `.env.example` to include all required API, web, and deployment variables.                   |
| `.gitignore`                                                                   |      26-27 | `*.env.*` would also ignore `.env.example`.                                                     | Add an explicit `!.env.example` exception.                                                          |
| `.gitignore`                                                                   |    overall | Ignore rules did not fully cover `.gradle`, nested `.idea`, web `dist`, or local web env files. | Add explicit ignore entries for generated and local-only artifacts.                                 |

## Local Files That Should Not Be Committed

These files or directories are present in the workspace and should stay uncommitted:

- `.env`
- `apps/web/.env.development`
- `apps/api/.gradle/`
- `apps/api/build/`
- `apps/api/.idea/`
- `apps/web/dist/`
- `**/.DS_Store`

## Changes Applied

- Parameterized remaining Compose deployment values with environment variables.
- Expanded `.env.example` to cover API, web, OAuth, mail, Redis, image, and container image settings.
- Updated OpenAPI server configuration to use the configured API host.
- Replaced the personal policy contact email with a public placeholder.
- Strengthened `.gitignore` for generated and local-only files.

## Follow-Up Before Publishing

1. Remove any generated or local-only files already present in the working tree before the first public commit.
2. Populate real secrets only in local or deployment-specific `.env` files, never in tracked files.
3. Replace placeholder contact addresses and image names with project-owned public values.
