# GitHub Pages Deployment Setup

## Goal Description

Enable automated deployment of the WordCandy application to GitHub Pages. The setup will support deploying the `main` branch to `https://anicolao.github.io/wordcandy` and Pull Requests to preview URLs like `https://anicolao.github.io/wordcandy/prNN`. This includes configuring Firebase Authentication to work with these new domains.

## User Review Required

> [!IMPORTANT]
> **Secrets Configuration**: You will need to add Firebase configuration keys as Secrets in your GitHub repository and update the Firebase Console to authorize the new domains. A detailed guide (`CONFIGURATION_GUIDE.md`) will be provided.

## Proposed Changes

### Configuration

#### [MODIFY] [package.json](file:///Users/anicolao/projects/antigravity/wordcandy/package.json)

- Add `@sveltejs/adapter-static`.
- Remove `@sveltejs/adapter-auto`.

#### [MODIFY] [svelte.config.js](file:///Users/anicolao/projects/antigravity/wordcandy/svelte.config.js)

- Switch adapter to `adapter-static`.
- Configure `paths.base` to use `process.env.PUBLIC_BASE_PATH` for dynamic base path support (root vs PR subdirectories).

### Workflows

#### [NEW] [.github/workflows/deploy.yml](file:///Users/anicolao/projects/antigravity/wordcandy/.github/workflows/deploy.yml)

- Create a workflow that triggers on push to `main` and pull requests.
- Steps:
  - Checkout and setup Node.js.
  - Determine `base_path` (e.g., `/wordcandy` or `/wordcandy/pr12`).
  - Build application with necessary `VITE_FIREBASE_*` environment variables injected from Secrets.
  - Deploy to `gh-pages` branch using `peaceiris/actions-gh-pages`.
  - Comment on PRs with the preview URL.

### Documentation

#### [NEW] [docs/CONFIGURATION_GUIDE.md](file:///Users/anicolao/projects/antigravity/wordcandy/docs/CONFIGURATION_GUIDE.md)

- Instructions for finding Firebase config values.
- List of GitHub Secrets to create.
- Steps to add `anicolao.github.io` to Firebase Auth Authorized Domains.

## Verification Plan

### Automated Tests

- Run `npm run build` locally with `PUBLIC_BASE_PATH=/wordcandy` to verify the build configuration works.
- **Workflow Dry Run**: Since the actual deployment requires Secrets and GitHub environment, I will verify the workflow syntax and build step locally as much as possible.

### Manual Verification

- **User Action Required**:
  1.  Follow `docs/CONFIGURATION_GUIDE.md` to set up secrets.
  2.  Push the changes.
  3.  Verify the Action runs successfully on GitHub.
  4.  Verify the live URL and PR preview URL.
  5.  Test Google Sign-In on the deployed page to confirm Firebase Auth configuration.
