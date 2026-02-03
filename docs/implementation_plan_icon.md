# Implementation Plan - App Icon & PWA Setup

## Goal Description

Replace the placeholder favicon with a custom "WordCandy" app icon and configure the application as a simpler PWA (Progressive Web App) to ensure it looks professional when bookmarked to the home screen.

## User Review Required

> [!IMPORTANT]
> **Icon Selection**: Please review the 3 generated concepts and select one to proceed. The selected concept will be used to generate all necessary icon sizes.

## Proposed Changes

### Assets

Generate the following files in `static/` based on the selected concept:

- `favicon.png` (32x32)
- `apple-touch-icon.png` (180x180)
- `android-chrome-192x192.png` (192x192)
- `android-chrome-512x512.png` (512x512)
- `manifest.webmanifest` (New file)

### Configuration

#### [MODIFY] [src/app.html](file:///Users/anicolao/projects/antigravity/wordcandy/src/app.html)

- Add `<link rel="manifest" ...>`
- Add Apple mobile web app meta tags (capable, status-bar-style, title).
- Add `apple-touch-icon` link.

## Verification Plan

### Automated Tests

- None. This is a visual/configuration change.

### Manual Verification

1.  **Browser Tab**: Verify the favicon appears correctly in the browser tab.
2.  **Manifest**: Verify `manifest.webmanifest` is verifiable via DevTools -> Application -> Manifest.
3.  **Mobile/Simulator**:
    - Use Chrome DevTools "Add to Home Screen" simulation if available.
    - (Ideally) Deploy to a staging URL and test on an actual device (iPhone/Android) to verify the home screen icon and "standalone" launch behavior.
