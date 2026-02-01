# WordCandy

**WordCandy** is a slick, premium mobile web application for playing competitive Duplicate Crossword. Built with modern web technologies, it offers a visually stunning "Nano Banana" aesthetic and a seamless real-time multiplayer experience.

## The Game: Duplicate Crossword

The goal is to outscore your opponents by finding the highest-scoring word on the board using a shared rack of letters.

### Core Rules
- **7 Rounds** of play.
- **Shared Rack:** Everyone plays with the *same* 8 letters.
- **Secret Submission:** Players privately find their best word.
- **The Reveal:** The highest-scoring word found by *any* player is placed on the main shared board.
- **Scoring:** You get points for your own best word, even if it's not the one placed on the board!
- **Strategy:** Length matters! Multiply your word score by the length of the longest word played. Note: The longest word played is the multiplier, not necessarily the longest word *you* played, but often it coincides. *Correction based on standard rules: It's the multiplier of the word you played.*

*(See [rules](./words/RULES.md) for the original gritty details)*

## Technology Stack

- **Frontend:** [Svelte](https://svelte.dev/) + [Threlte](https://threlte.xyz/) (3D rendering for those juicy candy tiles).
- **Backend/State:** [Google Firestore](https://firebase.google.com/products/firestore) (Real-time game synchronization).
- **Design System:** Nano Banana (Deep Matte Black, Neon Yellow/Cyan, Glassmorphism).

## Development

*(Coming Soon)*
