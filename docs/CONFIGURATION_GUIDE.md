# Deployment Configuration Guide

To enable the GitHub Pages deployment and ensure Firebase Authentication works correctly on your new deployment URLs, follow these steps.

## 1. GitHub Secrets

Add the following secrets to your GitHub repository settings (`Settings` > `Secrets and variables` > `Actions` > `New repository secret`).

You can find these values in your local `.env` file or in the Firebase Console under Project Settings.

| Secret Name                         | Description                                                |
| ----------------------------------- | ---------------------------------------------------------- |
| `VITE_FIREBASE_API_KEY`             | Your Firebase API Key                                      |
| `VITE_FIREBASE_AUTH_DOMAIN`         | Your Auth Domain (e.g., `wordcandy-762b1.firebaseapp.com`) |
| `VITE_FIREBASE_PROJECT_ID`          | Your Project ID                                            |
| `VITE_FIREBASE_STORAGE_BUCKET`      | Your Storage Bucket                                        |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Your Messaging Sender ID                                   |
| `VITE_FIREBASE_APP_ID`              | Your App ID                                                |
| `VITE_FIREBASE_MEASUREMENT_ID`      | Your Measurement ID                                        |

## 2. Firebase Authentication Settings

Since the application will now be running on `https://anicolao.github.io`, you must authorize this domain in Firebase.

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Select your project (**wordcandy-762b1**).
3.  Navigate to **Authentication** > **Settings** > **Authorized domains**.
4.  Click **Add domain**.
5.  Enter: `anicolao.github.io`
6.  Click **Add**.

## 3. GitHub Pages Setup

Ensure your repository is configured to serve from the `gh-pages` branch.

1.  Go to your GitHub repository **Settings**.
2.  Navigate to **Pages**.
3.  Under **Build and deployment** > **Source**, select **Deploy from a branch**.
4.  Under **Branch**, select `gh-pages` and `/ (root)`. (Note: The `gh-pages` branch will be created automatically after the first successful workflow run).

## 4. Verification

After pushing your changes and configuring the secrets:

1.  A workflow run will start automatically.
2.  Once completed, valid links will be:
    - **Main**: `https://anicolao.github.io/wordcandy`
    - **PRs**: Check the PR comments for a preview link (e.g., `.../wordcandy/pr12/`).
3.  Visit the URL and attempt to **Sign in with Google**. If the popup opens and you can sign in, the configuration is correct.
