# Contributing

## Getting started

Requirements: Node.js `>=20.19.0`.

```bash
npm ci
npm run server   # terminal 1: backend on http://localhost:3000
npm run dev      # terminal 2: Vite frontend
```

Production build:

```bash
npm run build
NODE_ENV=production npm run server
```

## Before submitting

Run the full gate and make sure it passes:

```bash
npm test
npm run build
npm run audit
```

`npm test` runs the protocol compatibility matrix, the API tests, the
security tests, the frontend utility tests and the deployment tests.
If you change server behaviour, add or update a test in `tests/` rather
than relying on manual checks alone.

## What to keep in mind

- **Do not introduce new runtime dependencies without a reason.** The
  rate limiter and the admin-token check are intentionally hand-written
  with Node.js built-ins; a new dependency needs a justification in the
  pull request.
- **Do not upgrade `express` or `js-yaml` across major versions** in a
  drive-by change — those upgrades need their own compatibility testing.
- Keep the Chinese `README.md` and English `README_EN.md` in sync on the
  key parts (features, protocol / client tables, deployment, environment
  variables, API, FAQ, Security). If you change one, update the other.
- Do not commit secrets, tokens, passwords, private subscription URLs,
  `data/` contents, logs or build output (`dist/`). `ADMIN_TOKEN` and
  other credentials belong in environment variables, never in code.
- Keep user-facing error messages clear and free of internal details;
  do not log subscription contents or tokens.

## Pull requests

- Keep the change small and focused; one topic per pull request.
- Describe what changed, why, and how you verified it (commands and
  results). Update `CHANGELOG.md` under an "Unreleased" section when the
  change is user-visible.
- For security-sensitive changes (authentication, SSRF checks, limits),
  explain the threat you are addressing and what stays unauthenticated
  and why.

## Reporting issues

Use the Issue templates (bug report / feature request). For security
problems, follow [SECURITY.md](SECURITY.md) and report privately —
do not open a public issue.
