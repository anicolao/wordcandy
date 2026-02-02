# MVP Design: WordCandy - "Duplicate Crossword"

This document defines the **Minimum Viable Product (MVP)** for WordCandy. The goal is to ship a playable, "Duplicate Scrabble" style daily challenge: One Board, One Rack, Global Leaderboard.

## 1. Core Feature Set

### 1.1 Authentication (The Gate)
-   **Action**: Simple "Sign in with Google".
-   **Requirement**: Frictionless entry.
-   **State**: User ID is required to post scores.

### 1.2 The Daily Lobby
-   **View**: A landing page showing today's challenge status.
    -   "Play Daily Challenge #123" button.
    -   Countdown to next challenge.
    -   Current Global High Score (teaser).

### 1.3 Gameplay (The Core Loop)
-   **Board**: A scrollable/zoomable 3D grid (Threlte).
    -   Initially empty or containing yesterday's winning word (for continuity)? MVP: Starts empty or with a center star.
-   **Rack**: 8 fixed tiles (shared globally for the day).
-   **Interaction**: Drag and drop tiles from rack to board.
-   **Validation**:
    -   Check dictionary connectivity.
    -   Check valid words (Client-side dictionary for speed).
-   **Scoring (Real-time)**:
    -   Sum of tiles * Longest word length.
    -   Display score dynamically as tiles are placed.
-   **Submission**:
    -   "Submit Word" button.
    -   Confirmation modal.
    -   On submit: Write `WORD_SUBMITTED` event to Firestore.

### 1.4 Post-Game / Leaderboard
-   **View**: After submission, show the Global Leaderboard.
    -   Rank users by score.
    -   Highlight "You".
    -   Read-only view of the board (maybe users can see the winning word revealed at the end of the day, but for MVP maybe just the list).

## 2. Technical Architecture (MVP)

### 2.1 State Management (Event Sourcing)
-   **Redux Store Contexts**:
    -   `Game`: actions `PLACE_TILE`, `REMOVE_TILE`, `SUBMIT_WORD`.
    -   `Session`: actions `USER_LOGGED_IN`.
-   **Persistence**:
    -   Game moves (draft) are local-only until submission.
    -   Submission is the *only* broadcast event in the MVP to save writes?
    -   *Correction*: For "Duplicate" style, we might not need real-time multiplayer moves visible to others *during* play.
    -   **Decision**: MVP does *not* broadcast every tile move to other players (anti-cheating). It only broadcasts the final `SUBMIT_WORD` event.
    -   *However*: To support "save for later" or multi-device, we should verify if intermediate moves are stored locally or cloud. For MVP: LocalStorage for draft, Firestore for Submission.

### 2.2 Firestore Schema
-   `challenges/{date}`:
    -   `date`: string (YYYY-MM-DD)
    -   `tiles`: string[] (The 8 letters)
    -   `winningSubmission`: { uid, word, score } (Updated via Cloud Function?)
-   `submissions/{submissionId}`:
    -   `challengeId`: string
    -   `uid`: string
    -   `word`: string[]
    -   `score`: number
    -   `tiles`: PlacedTile[]
    -   `timestamp`: serverTimestamp

### 2.3 Visuals (Nano Banana)
-   **Theme**: Dark mode default.
-   **Tiles**: 3D rendered cubes/lozenges (Threlte).
-   **Grid**: Neon lines.

## 3. Milestones

1.  **Walking Skeleton**: Auth -> Empty Board -> Submit Dummy Score -> Leaderboard.
2.  **Gameplay**: Drag/Drop + Validation + Real Scoring.
3.  **Polish**: Threlte 3D Tiles + "Juice" (Sound, Haptics).

## 4. Omissions (Not in MVP)
-   Real-time spectating of other players.
-   Chat.
-   User Profiles / History.
-   Leagues.
-   Tutorial Mode.
