# Changelog

All notable changes to this project are documented in this file. The format
follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the
project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-11-24

First tagged release. The code in this release is the state of `main` as of
2026-11-24, plus the security hardening listed below.

### Added

- Global basic rate limiting, hand-written with no new dependencies
  (defaults: 300 requests per IP per 60-second window, `429` with a
  `Retry-After` header; tunable with `RATE_LIMIT_WINDOW_MS` /
  `RATE_LIMIT_MAX`, `RATE_LIMIT_MAX=0` disables it).
- Optional admin authentication for short link management: when
  `ADMIN_TOKEN` is set, creating, listing and deleting short links require
  the token via the `X-Admin-Token` header or the `?token=` query
  parameter. When it is not set, management stays unauthenticated as
  before and the server logs a warning at startup.
- Admin-token field on the web console's short link page (kept only in
  the browser's sessionStorage, sent as the `X-Admin-Token` header).
- `CHANGELOG.md`, `SECURITY.md`, `CONTRIBUTING.md` and GitHub Issue
  templates for bug reports and feature requests.

### Changed

- Node health check: a single request now tests at most 100 nodes
  (was 500); `timeout` is clamped to 250–10000 ms (was 250–30000 ms)
  and `concurrent` to 1–10 (was 1–20).
- `README.md` / `README_EN.md`: corrected the deployment story — this
  project does **not** support Vercel one-click deploy (no `vercel.json`,
  no Deploy button); it needs a long-running Node.js service with a
  writable data directory. The old repository description claiming
  "Vercel one-click deploy" is wrong and must be removed from the
  repository description on the GitHub website (it is not stored in the
  code). Added a Security section documenting rate limiting and the
  optional admin token.
- `README_EN.md` expanded to match the Chinese README on the key parts:
  screenshots, protocol / client tables, deployment, environment
  variables, API, FAQ and Security.

### Notes for existing deployments

- If you set `ADMIN_TOKEN`, update any scripts that create, list or
  delete short links to send the token, and enter it in the web
  console's short link page. The short link redirect itself
  (`GET /s/:code`) never requires a token.
- Health checks of subscriptions with more than 100 nodes now return
  only the first 100 results; split larger subscriptions into batches.

[1.0.0]: https://github.com/tony-wang1990/laowang-sub-converter/releases/tag/v1.0.0
