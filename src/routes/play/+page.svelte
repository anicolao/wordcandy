<script lang="ts">
    import { page } from '$app/stores';
    import UnifiedGame from '$lib/components/game/UnifiedGame.svelte';
    import { store } from '$lib/store';
    import { type PlayerState } from '$lib/reducers/game';
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { Pane } from 'tweakpane';

    // Get player state from store (reactive)
    $: player = ($store.auth.uid ? $store.game.players[$store.auth.uid] : null) as PlayerState | undefined;
    $: rack = player?.rack || [];
    $: frozen = $page.url.searchParams.get('frozen');

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === '`') {
            showControls = !showControls;
        }
    }
    
    let camPos: [number, number, number] = [0, 45, 12];
    let camFov = 30;
    
    // Debug State - Visuals
    let debugColor = "#FFE135";
    let debugOpacity = 0.2;
    let showControls = false;

    // Rack Scene Debug
    let rackGridColor = '#00ffff';
    let rackGridBackgroundColor = '#2a2a2a';
    let rackLightIntensity = 4.0;
    let rackGridOffsetZ = 5.0; // Updated default per user
    let rackTileOffsetZ = -1.2; // Updated default per user

    // Helper to handle Tweakpane v3 (addInput) vs v4 (addBinding) mismatch
    const addBinding = (parent: any, target: any, key: string, params: any) => {
        if (parent.addBinding) {
            return parent.addBinding(target, key, params);
        } else if (parent.addInput) {
            return parent.addInput(target, key, params);
        } else {
            console.error('Tweakpane parent missing addBinding/addInput', parent);
            return { on: () => {} }; // Dummy return to prevent chain crashes
        }
    };

    onMount(() => {
        if (!browser) return; // Client-side only
        
        // Auto-Initialize Local User if missing
        if (!player && $store.auth.uid === 'local-user-123') {
            console.log('Auto-initializing local player...');
            store.dispatch({ type: 'game/joinGame', payload: { uid: 'local-user-123', name: 'Player 1' } });
            // Reducer expects { playerId }, not { uid, count }
            store.dispatch({ type: 'game/drawTiles', payload: { playerId: 'local-user-123' } });
        }

        try {
            const container = document.getElementById('debug-container');
            // Cast to any to bypass strict TS checks for Tweakpane structure
            const pane = new Pane({ 
                title: 'Debug Controls', 
                expanded: true,
                container: container || undefined 
            }) as any;
            
            // Rack Visuals
            const f1 = pane.addFolder({ title: 'Rack' });
            
            addBinding(f1, { val: rackGridOffsetZ }, 'val', { min: -5, max: 10, step: 0.1, label: 'Grid Z' })
              .on('change', (ev: any) => rackGridOffsetZ = ev.value);

            addBinding(f1, { val: rackTileOffsetZ }, 'val', { min: -5, max: 10, step: 0.1, label: 'Tiles Z' })
              .on('change', (ev: any) => rackTileOffsetZ = ev.value);
              
            addBinding(f1, { val: rackGridColor }, 'val', { label: 'Grid Color' })
              .on('change', (ev: any) => rackGridColor = ev.value);
              
            addBinding(f1, { val: rackGridBackgroundColor }, 'val', { label: 'Grid BG' })
              .on('change', (ev: any) => rackGridBackgroundColor = ev.value);
              
            addBinding(f1, { val: rackLightIntensity }, 'val', { min: 0, max: 20, label: 'Light' })
              .on('change', (ev: any) => rackLightIntensity = ev.value);

            // Tile Visuals
            const f2 = pane.addFolder({ title: 'Tiles' });
            
            addBinding(f2, { val: debugColor }, 'val', { label: 'Color' })
                 .on('change', (ev: any) => debugColor = ev.value);
                 
            addBinding(f2, { val: debugOpacity }, 'val', { min: 0, max: 1, label: 'Opacity' })
                 .on('change', (ev: any) => debugOpacity = ev.value);
                 
             // Camera
            const f3 = pane.addFolder({ title: 'Camera' });
            
            addBinding(f3, { val: showControls }, 'val', { label: 'Orbit Controls' })
                .on('change', (ev: any) => showControls = ev.value);

            addBinding(f3, { val: camFov }, 'val', { min: 10, max: 100, step: 1 })
                .on('change', (ev: any) => camFov = ev.value);
                
            f3.addButton({ title: 'Reset Cam' }).on('click', () => camPos = [0, 40, 5]);

            // Actions
            const f4 = pane.addFolder({ title: 'Actions' });
            f4.addButton({ title: 'Deal Hand' }).on('click', () => {
                 console.log('Forcing Deal Hand...');
                 store.dispatch({ type: 'game/joinGame', payload: { uid: 'local-user-123', name: 'Player 1' } });
                 store.dispatch({ type: 'game/drawTiles', payload: { playerId: 'local-user-123' } });
            });

            return () => pane.dispose();
        } catch (err) {
            console.error('Failed to initialize Debug Controls:', err);
        }
    });
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="game-container">
    <!-- Container for specific positioning of Tweakpane -->
    <div id="debug-container"></div>

    <header class="game-header">
        <h2 class="neon-text" style="margin: 0;">Daily Challenge</h2>
        <div class="score">Score: {player?.score || 0}</div>
    </header>

    <div class="game-area">
        <UnifiedGame 
            bind:camPos={camPos}
            bind:camFov={camFov}
            showControls={showControls}
            {debugColor}
            {debugOpacity}
            {rackGridColor}
            {rackGridBackgroundColor}
            lightIntensity={rackLightIntensity}
            {rackGridOffsetZ}
            {rackTileOffsetZ}
            {frozen}
        />
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

<style>
    .game-container {
        width: 100vw;
        height: 100vh;
        background: #000;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .game-header {
        height: 60px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        background: rgba(0,0,0,0.8);
        border-bottom: 1px solid #333;
        z-index: 10;
    }

    .game-area {
        flex: 1;
        position: relative;
        min-height: 0; /* Prevent flex collapse */
        width: 100%;
    }

    .neon-text {
        font-family: 'Outfit', sans-serif;
        color: #fff;
        text-shadow: 0 0 10px #0ff;
    }

    .score {
        font-family: 'Outfit', sans-serif;
        color: #fff;
        font-size: 1.2rem;
    }

    .accessible-hidden {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }

    #debug-container {
        position: absolute;
        top: 70px; /* Below header (60px) + gap */
        right: 20px;
        width: 280px; /* Standard Tweakpane width */
        z-index: 100;
    }
</style>
