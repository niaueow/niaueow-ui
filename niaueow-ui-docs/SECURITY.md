# Security Policy

## Supported versions

| Version | Supported |
|---|---|
| Latest 0.x minor | Yes |
| Older 0.x minors | No |

Security fixes are released as a patch on the latest minor version.

## Reporting a vulnerability

Do not open a public issue for security problems.

Report privately through GitHub: go to the repository's **Security** tab and choose **Report a vulnerability**. Include:

- affected version(s)
- a description of the issue and its impact
- steps or a minimal reproduction

You should receive a response within 7 days. Once a fix is released, the advisory is published with credit to the reporter unless you ask otherwise.

## Scope

In scope:
- the published `@niaueow/ui` package
- the build, release and publishing pipeline in this repository

Out of scope:
- vulnerabilities in dependencies that are already publicly reported upstream (Dependabot handles these)
- issues in the playground apps that do not affect the published package

## How this project protects users

- **No raw HTML rendering.** Components never use `v-html` or render HTML strings from props. Enforced by ESLint.
- **Minimal runtime dependencies.** Only `reka-ui`, the variant library, `tailwind-merge` and `clsx`.
- **Locked, delayed dependencies.** Lockfile is committed, CI installs with `--frozen-lockfile`, new dependency versions must be a few days old before install, and dependency install scripts are blocked unless allowlisted.
- **No long-lived publish token.** Releases are published from GitHub Actions through npm trusted publishing (OIDC). Token-based publishing is disabled in the npm package settings.
- **Provenance.** Every published version carries npm provenance, linking it to the exact commit and workflow run. Verify with `npm audit signatures`.
- **Hardened CI.** Third-party actions are pinned to commit SHAs, workflows run with read-only permissions by default, and secrets are never exposed to pull request workflows.
- **Static analysis.** CodeQL runs on every push to `main` and on pull requests.
- **Validated token input.** The token build script rejects malformed values so a bad Figma export cannot inject CSS.
