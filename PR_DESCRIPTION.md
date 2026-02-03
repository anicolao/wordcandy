## User Request
The icon looks great on my homescreen. But the URL that gets bookmarked is wrong, it's https://anicolao.github.io/ (it is missing /wordcandy) and the name of the game should be "Word Candy" as two words. Let's make a new PR that fixes these issues and push it up to gh.

## Changes
- Updated `manifest.webmanifest`:
    - Changed `name` and `short_name` to "Word Candy".
    - Changed `start_url` to `.` to support subdirectories (like `/wordcandy/`).
- Updated `src/app.html`:
    - Changed `apple-mobile-web-app-title` to "Word Candy".
