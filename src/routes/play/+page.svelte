<script lang="ts">
    import { onMount } from 'svelte';
    import { Canvas } from '@threlte/core'; // Import Canvas
    import Board from '$lib/components/game/Board.svelte';
    import Scene from '$lib/components/game/Scene.svelte';
    import Tile3D from '$lib/components/game/Tile3D.svelte';
    import { store } from '$lib/store';
    import { initializeGame, drawTiles } from '$lib/reducers/game';
    
    // Reactive derived state
    $: user = $store.auth?.user; // Assuming auth structure
    $: uid = $store.auth?.uid; 
    $: game = $store.game;
    $: player = uid && game?.players ? game.players[uid] : null;
    $: rack = player ? player.rack : [];
    
    onMount(() => {
        if (uid && (!game?.players || !game.players[uid])) {
             store.dispatch(initializeGame({ playerIds: [uid] }));
            // Draw initial tiles
            store.dispatch(drawTiles({ playerId: uid }));
        }
    });

    function handleDraw() {
        if (uid) {
            store.dispatch(drawTiles({ playerId: uid }));
        }
    }
</script>

<div class="game-container">
    <header class="game-header">
        <h2 class="neon-text" style="margin: 0;">Daily Challenge</h2>
        <div class="score">Score: {player?.score || 0}</div>
    </header>

    <div class="board-area">
        <!-- <Board /> -->
        <!-- Placeholder retained for stability while focused on Rack -->
        <div class="board-wrapper" style="color: white; background: #333; height: 60vh; border-radius: 12px;">Board Placeholder</div>
    </div>

    <!-- 3D Rack Area -->
    <div class="rack-area glass-panel">
        <div class="rack-3d-container">
            <Canvas>
                <Scene rackMode={true}>
                    {#each rack as tile, i}
                        <!-- Position calculations: centered, with gap -->
                        <Tile3D 
                            position={[(i - 3.5) * 2.5, 0, 0]}
                            rotation={[-Math.PI / 8, 0, 0]} 
                            scale={2.0}
                            letter={tile.letter} 
                            value={tile.value} 
                        />
                    {/each}
                 </Scene>
            </Canvas>
        </div>

        <!-- Hidden accessible HTML rack for E2E tests and screen readers -->
        <div class="rack-slots accessible-hidden">
            {#each Array(8) as _, i}
                <div class="rack-slot">
                    {#if rack[i]}
                        <div class="tile">
                            <span class="letter">{rack[i].letter}</span>
                            <span class="value">{rack[i].value}</span>
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    </div>
    
    <div class="controls">
        <button class="action-btn" on:click={handleDraw}>Draw/Shuffle</button>
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
        height: 150px; /* Increased for 3D view */
        position: relative;
    }
    
    .rack-3d-container {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
        background: pink; /* DEBUG: Check container size */
    }
    
    .accessible-hidden {
        opacity: 0;
        pointer-events: none;
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
    }


    .tile {
        width: 100%;
        height: 100%;
        background: #f0f0f0; /* Default light tile */
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    
    /* Nano Banana Aesthetic overrides could go here */
    :global(.dark) .tile {
        background: #333;
        color: #fff;
    }

    .letter {
        font-size: 1.2rem;
        font-weight: bold;
        color: #333;
    }

    .value {
        position: absolute;
        bottom: 2px;
        right: 2px;
        font-size: 0.5rem;
        color: #666;
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
