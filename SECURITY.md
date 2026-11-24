# Security Policy

## Supported versions

| Version | Supported |
| --- | --- |
| 1.0.x (`main`) | Yes |
| Older / untagged `main` snapshots | No — please update to the latest release or `main` first |

## Reporting a vulnerability

**Do not open a public issue for a security problem.** Report it privately
through one of these channels:

- GitHub: open an issue using the "Report a vulnerability" / private
  vulnerability reporting feature on the repository's Security tab, or
- Contact the repository owner (`tony-wang1990`) through GitHub.

Please include:

1. What the vulnerability is and where it is (file / endpoint).
2. Steps to reproduce it, with the smallest possible example.
3. What impact you think it has (e.g. who can exploit it and what they gain).

We will acknowledge the report, assess it, and fix it before disclosing
anything publicly. If the issue is confirmed, the fix is released first
and the details are disclosed afterwards.

## Deployment security notes

- **Set `ADMIN_TOKEN` before exposing the service publicly.** Without it,
  anyone who can reach the service can create, list and delete short
  links. Use a long random value, e.g. `openssl rand -hex 32`, and send
  it with the `X-Admin-Token` header rather than the `?token=` query
  parameter (a token in a URL ends up in browser history and server logs).
- Keep `ALLOW_PRIVATE_SUBSCRIPTION_URLS=0` (the default) unless the
  deployment really needs to fetch intranet subscriptions. Setting it to
  `1` on a public instance lets the backend reach private addresses.
- The global rate limiter defaults to 300 requests per IP per minute.
  It is a basic abuse brake, not a substitute for a reverse proxy or
  firewall in front of a public deployment.
- Do not share subscription URLs containing credentials, and do not paste
  private subscription URLs, tokens or node addresses into public issues.
