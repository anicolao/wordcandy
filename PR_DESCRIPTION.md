## User Request
We have the beginnings of a word game in this repository. Currently, it can be deployed to firebase hosting and that should work fine; but I also want to be able to have it build and deploy to github pages very much like the food/ example repository, so that I can review individual PRs and look at main by going to https://anicolao.github.io/wordcandy or https://anicolao.github.io/wordcandy/prNN where prNN would be for example pr12 for PR#12.

The workflows to build and deploy in this environment need to be set up, and I'll need a configuration guide for setting up GH pages secrets so that firebase will work, and that configuration guide should also specify what I need to do to enable firebase auth to work on this new URL. Implement all of that following WORKFLOW.md to put up a PR for my review.

## Changes
- Updated `svelte.config.js` to use `adapter-static` and support dynamic base paths.
- Added `.github/workflows/deploy.yml` for automated deployment to GitHub Pages (main branch) and preview deployments (PRs).
- Created `docs/CONFIGURATION_GUIDE.md` detailing how to set up secrets and Firebase Auth.
- Moved `implementation_plan.md` to `docs/`.
