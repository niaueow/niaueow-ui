# Maintaining

Steps the maintainer runs by hand: account security, repository settings, the first publish, releases and deployment. Automation (CI, Claude Code) never publishes, pushes or changes these settings.

## One-time setup

Do these in order.

### 1. Secure your accounts
- Enable 2FA on GitHub.
- Create the npm account `niaueow` (the package scope `@niaueow` must match the username or an npm organization you own).
- Enable 2FA on npm for **authorization and writes**, using an authenticator app or security key.

### 2. Create the GitHub repository
1. Create `niaueow/niaueow-ui` as a public repo, without a README (the project already has one).
2. Push:
   ```bash
   git remote add origin https://github.com/niaueow/niaueow-ui.git
   git push -u origin main
   ```

### 3. Repository settings
- **Settings → Code security:** enable Dependabot alerts, Dependabot security updates, secret scanning and push protection, and **private vulnerability reporting**.
- **Settings → Actions → General:** workflow permissions set to *Read repository contents*; allow GitHub Actions to create pull requests (needed for the Changesets version PR).
- **Settings → Environments → New environment `npm-publish`:** under *Deployment branches and tags* choose *Selected branches* and add `main` only. Optionally add yourself as a required reviewer so every publish waits for your approval. The release workflow's `publish` job runs in this environment.
- **Settings → Branches → Add rule for `main`** (or a ruleset):
  - require a pull request before merging
  - require status checks to pass (select the CI jobs)
  - block force pushes and deletion

### 4. First publish (manual)
npm trusted publishing is configured per package, so the package may need to exist before CI can publish it. Check the current npm docs; if a first manual publish is required:

```bash
pnpm install --frozen-lockfile
pnpm verify
cd packages/ui
npm login
npm publish --access public
```

Use version `0.0.0` or the initial `0.1.0` changeset version. Run this from a clean clone of `main`.

### 5. Configure trusted publishing
1. On npmjs.com, open `@niaueow/ui` → **Settings → Trusted Publisher**.
2. Choose GitHub Actions and enter: owner `niaueow`, repository `niaueow-ui`, workflow filename `release.yml`, environment `npm-publish`. Setting the environment means a branch that edits the workflow cannot publish, because the environment only allows `main`. The `repository.url` in `packages/ui/package.json` must match this repository exactly, and a new trusted publisher configuration must complete its first publish within 2 days or it expires. Trusted publishing needs npm CLI 11.5.1+ and Node 22.14+; the release workflow uses the Node version in `.nvmrc`.
3. Under **Publishing access**, require 2FA and **disallow tokens**, so the only way to publish is the trusted workflow.
4. Revoke any npm tokens you created.

### 6. Deploy Storybook to Vercel
1. Import the GitHub repo in Vercel.
2. Settings:

   | Setting | Value |
   |---|---|
   | Root directory | `packages/ui` |
   | Framework preset | Other |
   | Install command | `pnpm install --frozen-lockfile` |
   | Build command | `pnpm build-storybook` |
   | Output directory | `storybook-static` |

3. Deploy, then add the URL to `README.md` (`<<STORYBOOK_URL>>`).

Production deploys from `main`; pull requests get preview URLs.

## Releasing

Releases run through Changesets and `.github/workflows/release.yml`.

1. Every PR that changes the published package includes a changeset (`pnpm changeset`).
2. When PRs merge to `main`, the release workflow opens or updates a **Version Packages** PR. It bumps the version and writes `CHANGELOG.md`.
3. Review that PR. When you merge it, the workflow's `pack` job runs `pnpm verify` and packs the tarball, and the `publish` job publishes it to npm with provenance through trusted publishing. Only the `publish` job has `id-token: write`, and it runs no project build.
4. Check the release:
   ```bash
   npm view @niaueow/ui version
   npm audit signatures
   ```

Versioning policy: [ROADMAP.md](../ROADMAP.md#versioning-policy).

### If a release is broken
- Publish a fix as a new patch through the normal flow.
- Use `npm deprecate @niaueow/ui@<version> "<reason>"` to warn installers.
- Avoid `npm unpublish`; it breaks anyone who installed that version and is restricted after 72 hours.

## Dependency updates

- Dependabot opens weekly grouped PRs for npm and GitHub Actions.
- CI must pass. Read the changelog for anything touching Vue, Tailwind, Reka UI, Vite or Storybook.
- pnpm's minimum release age means very new versions are skipped until they have aged; this is intentional.
- When adding a dependency that needs an install script, add it to the pnpm build-script allowlist (`allowBuilds` in `pnpm-workspace.yaml`) only after checking what the script does. An unreviewed build script fails the install.
- GitHub Actions stay pinned to commit SHAs; Dependabot updates the SHA and the version comment together.

## Security advisories

Reports arrive through private vulnerability reporting (see [SECURITY.md](../SECURITY.md)).

1. Confirm and assess impact.
2. Fix in a private fork or a draft security advisory.
3. Release a patch.
4. Publish the advisory with credit.

## Updating tokens

See [TOKENS.md](./TOKENS.md#updating-tokens-after-a-figma-change).

## Checklist before each minor release

- [ ] All components in the batch meet the [definition of done](./COMPONENT-GUIDELINES.md#definition-of-done)
- [ ] README component table updated
- [ ] ROADMAP updated
- [ ] Storybook deployed and checked in both modes
- [ ] Playgrounds build
- [ ] Changeset summaries readable as release notes
