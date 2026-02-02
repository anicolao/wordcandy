<script>
    import Board from '$lib/components/game/Board.svelte';
    import { store } from '$lib/store';
    
    // Mock initializing game
    // store.dispatch(initializeGame({...}))
</script>

<div class="game-container">
    <header class="game-header">
        <h2 class="neon-text" style="margin: 0;">Daily Challenge</h2>
        <div class="score">Score: {$store.game.score}</div>
    </header>

    <div class="board-area">
        <Board />
    </div>

    <div class="rack-area glass-panel">
        <!-- Rack placeholder -->
        <div class="rack-slots">
            {#each Array(8) as _, i}
                <div class="rack-slot"></div>
            {/each}
        </div>
    </div>
    
    <div class="controls">
        <button class="action-btn">Shuffle</button>
        <button class="action-btn submit-btn">Submit</button>
    </div>
</div>

<style>
    .game-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        padding: 1rem;
        box-sizing: border-box;
        gap: 1rem;
    }

    .game-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .board-area {
        flex: 1;
        min-height: 0; /* Allow shrink */
    }

    .rack-area {
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .rack-slots {
        display: flex;
        gap: 0.5rem;
    }
    
    .rack-slot {
        width: 60px;
        height: 60px;
        background: rgba(255,255,255,0.1);
        border-radius: 8px;
        border: 1px solid rgba(255,255,255,0.2);
    }
    
    .controls {
        display: flex;
        justify-content: space-between;
    }
    
    .action-btn {
        background: rgba(255,255,255,0.1);
        border: 1px solid var(--color-nano-cyan);
        color: var(--color-nano-cyan);
        padding: 10px 20px;
        border-radius: 20px;
        cursor: pointer;
        font-family: var(--font-main);
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    
    .submit-btn {
        background: var(--color-nano-cyan);
        color: black;
        font-weight: bold;
    }
</style>
