# Firebase Authentication Setup for Hosted Environments

To enable manual user testing on deployments (GitHub Pages, Firebase Hosting, Vercel, etc.), you must configure Firebase Authentication to accept requests from your specific hosting domain.

## 1. Authorized Domains

By default, Firebase Auth only allows requests from `localhost` and your Firebase project domains.

1.  Go to the [Firebase Console](https://console.firebase.google.com/u/0/project/wordcandy-762b1/authentication/settings).
2.  Navigate to **Authentication** > **Settings** > **Authorized Domains**.
3.  Click **Add Domain**.
4.  Add the domain for your hosting provider:
    - **GitHub Pages**: `anicolao.github.io` (or your specific pages domain).
    - **Vercel**: `your-project.vercel.app`.
    - **Netlify**: `your-project.netlify.app`.

## 2. Sign-In Method

Ensure **Google** is enabled as a Sign-In method:

1.  Navigate to **Authentication** > **Sign-in method**.
2.  Click **Add new provider** > **Google**.
3.  Enable it and save.

## 3. Environment Variables (If Applicable)

Your local development uses the checked-in standard config in `src/lib/firebase.ts`.

If you use a different Firebase project for Production vs Staging, you should use Environment Variables (`.env`) to populate the config object in `src/lib/firebase.ts`.

Currently, the code uses a hardcoded configuration:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyDWrBRQmuUsXbBafUL5nrZ34YbqQnXQZJk",
  authDomain: "wordcandy-762b1.firebaseapp.com",
  // ...
};
```

To support multiple environments, update `src/lib/firebase.ts` to use `import.meta.env`:

```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // ...
};
```

## 4. GitHub Actions / CI Considerations

Our CI workflow (`.github/workflows/playwright.yml`) uses the **Firebase Auth Emulator** to test authentication logic without hitting the live backend.

- **Emulator Host**: `localhost:9099`
- **Command**: `npx firebase emulators:exec --only auth "npm run test:e2e"`

This ensures that Pull Request validation is self-contained and does not require credentials for the live production project.
