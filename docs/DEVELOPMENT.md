# Development Guide

This document explains how to develop Sisyphus Academy locally.

## Project Structure

```text
apps/
  api/
  web/
  chrome-extension/
gateway/
docs/
```

---

## API

Start the API server:

```bash
cd apps/api
./gradlew bootRun
```

Build the API:

```bash
./gradlew build
```

Run API tests:

```bash
./gradlew test
```

Run the full backend quality gate:

```bash
./gradlew clean check
```

This runs:

- unit, slice, repository, and integration tests
- JaCoCo coverage verification
- Checkstyle on main and test sources
- SpotBugs on main sources

Generated reports live under:

- `apps/api/build/reports/tests/test`
- `apps/api/build/reports/jacoco/test`
- `apps/api/build/reports/checkstyle`
- `apps/api/build/reports/spotbugs`
- `apps/api/build/generated/openapi/openapi.json`

Swagger and OpenAPI are available during local API runs at:

- `http://localhost:8080/swagger-ui/index.html`
- `http://localhost:8080/v3/api-docs`

---

## Web

Start the web app:

```bash
cd apps/web

npm install
npm run dev
```

Build the web app:

```bash
npm run build
```

---

## Chrome Extension

Install dependencies:

```bash
cd apps/chrome-extension

bun install
```

Build extension:

```bash
bun run build
```

Type check extension sources:

```bash
bun run compile
```

---

## Local Stack

Start the full stack with Docker Compose:

```bash
docker compose up -d
```

---

## Coding Guidelines

- Prefer small focused functions.
- Avoid duplicated logic.
- Use meaningful names.
- Keep business logic separated from infrastructure concerns.
- Add tests when introducing new behavior.

---

## Commit Convention

Examples:

```text
feat: add vocabulary search
fix: resolve login issue
docs: update deployment guide
refactor: simplify oauth flow
test: add email verification tests
```
