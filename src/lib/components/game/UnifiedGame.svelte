<script lang="ts">
  import { Canvas, T, useThrelte, useTask } from '@threlte/core';
  import { interactivity } from '@threlte/extras';
  import { Raycaster, Vector2 } from 'three';
  import { spring } from 'svelte/motion';
  import { tick } from 'svelte';
  import Scene from './Scene.svelte';
  import CyberGrid from './CyberGrid.svelte';
  import InfiniteBoard from './InfiniteBoard.svelte';
  import Tile3D from './Tile3D.svelte';
  import { store, startDrag, stopDrag } from '../../store';
  import { placeTile, returnTileToRack, type Tile, type PlayerState } from '../../reducers/game';

  // interactivity(); // Moved to Scene.svelte to be inside Canvas context

  export let showControls = false;
  export let camPos: [number, number, number] = [0, 40, 5]; 
  export let camFov = 35;
  
  // Visual / Debug Props
  export let debugColor = "#FFE135";
  export let debugOpacity = 0.2;
  export let rackGridColor = '#00ffff';
  export let rackGridBackgroundColor = '#1a001a';
  export let lightIntensity = 4.0;
  export let rackGridOffsetZ = 1.25;
  export let rackTileOffsetZ = 0.0; // New Prop
  export let frozen: string | null = null;

  // Rack Layout Constants
  const RACK_Z_OFFSET = 12; // In front of the board
  const RACK_Y_OFFSET = 0;  // Same plane
  const TILE_SPACING = 2.5;
  const CELL_SPACING = 1.25; // Matching InfiniteBoard

  $: player = ($store.auth.uid ? $store.game.players[$store.auth.uid] : null) as PlayerState | undefined;
  $: rack = player?.rack || [];
  $: board = $store.game.board || {};
  $: draggingId = $store.drag.draggingTileId;

  // Interaction Global State
  let pointerPos = { x: 9999, z: 9999 };
  let ghostPos: [number, number, number] | null = null;
  let potentialDragId: string | null = null;
  let dragStartPos: { x: number, z: number } | null = null;
  
  // Drag Animation
  const dragScale = spring(1.8, { stiffness: 0.1, damping: 0.4 });
  const dragZOffset = spring(0, { stiffness: 0.1, damping: 0.4 });

  // Drag State
  function handlePointerMove(e: any) {
    if (!e.point) return;
    
    const x = e.point.x;
    const z = e.point.z;
    pointerPos = { x, z }; 

    // Threshold Check Logic
    if (potentialDragId && dragStartPos) {
        const dist = Math.sqrt(Math.pow(x - dragStartPos.x, 2) + Math.pow(z - dragStartPos.z, 2));
        if (dist > 0.5) {
             console.log('Drag Threshold Exceeded:', potentialDragId);
             
             // Initial Zone Check using raw Z
             if (z < 9) {
                 dragScale.set(1.0);
                 dragZOffset.set(-1.5 * CELL_SPACING); // Target Offset
             } else {
                 dragScale.set(1.8);
                 dragZOffset.set(0);
             }

             // Initialize Ghost with CURRENT spring values (approximate start)
             // We can't wait for spring, so we start at current pos + instant offset if needed?
             // Actually, letting it spring from 0 is better visual.
             ghostPos = [x, 1.0, z]; // Start "at finger", then tween away.
             
             store.dispatch(startDrag(potentialDragId));
             potentialDragId = null;
             dragStartPos = null;
        }
    }

    if (draggingId) {
        if (z < 9) {
             // Board Zone
             dragScale.set(1.0);
             dragZOffset.set(-1.5 * CELL_SPACING);
             ghostPos = [x, 0.17, z + $dragZOffset]; // Apply Offset
        } else {
             // Rack Zone
             dragScale.set(1.8);
             dragZOffset.set(0);
             ghostPos = [x, 1.0, z + $dragZOffset];
        }
    }
  }

  function handlePointerUp(e: any) {
    // Clear potential drag if it was just a click
    potentialDragId = null;
    dragStartPos = null;

    if (draggingId && ghostPos) {
        const [x, y, z] = ghostPos;
        console.log('Drop at', x, z);
        
        // Drop Logic
        if (z < 9) {
             store.dispatch(placeTile({
                 tileId: draggingId,
                 x: Math.floor(x / CELL_SPACING),
                 y: Math.floor(z / CELL_SPACING)
             }));
        } else {
             store.dispatch(returnTileToRack({ tileId: draggingId }));
        }
        store.dispatch(stopDrag());
    }
    ghostPos = null;
    dragScale.set(1.8); 
    dragZOffset.set(0); 
  }
  
  async function handlePointerDown(tileId: string, e: any) {
       // Unwrap CustomEvent detail if present (from Svelte component dispatch)
       const eventData = e.detail || e;
       console.log('DOWN: Potential Drag', tileId, eventData.point);
       
       if (e.stopPropagation) e.stopPropagation();
       if (eventData.stopPropagation) eventData.stopPropagation();

       if (tileId && eventData.point) {
           // Don't start drag immediately. Wait for movement.
           potentialDragId = tileId;
           dragStartPos = { x: eventData.point.x, z: eventData.point.z };
       }
  }

  function getGhostTile(id: string) {
       return rack.find((t: Tile) => t.id === id) || Object.values(board).find((t: Tile) => t.id === id);
  }

  import { onMount } from 'svelte';
  
  $: {
      console.log('UnifiedGame State Update:', { 
          uid: $store.auth.uid, 
          playerExists: !!player, 
          rackLength: rack.length, 
          boardTiles: Object.keys(board).length,
          draggingId 
      });
  }
  $: spotlightPos = draggingId && ghostPos ? { x: ghostPos[0], z: ghostPos[2] } : pointerPos;
</script>

<div class="game-wrapper glass-panel" style:background={frozen ? '#000' : 'radial-gradient(circle at center, #111, #000)'}>
  {#if frozen}
    <!-- Ultimate Nuclear Option: Remove WebGL Context entirely to guarantee determinism -->
    <div class="frozen-surface" style="width: 100%; height: 100%; background: #000;"></div>
  {:else}
  <Canvas renderMode="always" antialias={!frozen}>

    <Scene 
        bind:cameraPosition={camPos}
        bind:cameraFov={camFov}
        enableControls={showControls}
        showGrid={false}
        {lightIntensity}
    >
        <!-- The Board (Visual Grid) -->
        <InfiniteBoard pointerPos={spotlightPos} />

        <!-- Board Tiles (Interactive) -->
        {#each Object.entries(board) as [key, tile] (tile.id)}
            {@const [gridX, gridY] = key.split(',').map(Number)}
            {@const isDragging = draggingId === tile.id}
            
            {#if !isDragging}
                <Tile3D
                    position={[(gridX + 0.5) * CELL_SPACING, 0.17, (gridY + 0.5) * CELL_SPACING]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    letter={tile.letter}
                    value={tile.value}
                    scale={1.0} 
                    color={debugColor}
                    opacity={debugOpacity}
                    on:pointerdown={handlePointerDown.bind(null, tile.id)}
                />
            {/if}
        {/each}

        <!-- The Rack Area Visuals -->
        <!-- Center Z is dynamic based on debug prop -->
        <T.Group position={[0, -0.25, RACK_Z_OFFSET + rackGridOffsetZ]}>
             <!-- Dark Background for Rack (Disabled for Contrast Check) -->
             <T.Mesh rotation={[-Math.PI/2, 0, 0]} position={[0, -0.05, 0]} interactive={false}>
                  <T.PlaneGeometry args={[12, 6.5]} />
                  <T.MeshBasicMaterial color="#000" transparent opacity={0.0} />
             </T.Mesh>
             <!-- Cyber Grid for Rack -->
             <CyberGrid 
                width={12}
                height={6.5}
                gridSize={20} 
                divisions={20} 
                color={rackGridColor}
                backgroundColor={rackGridBackgroundColor}
                {frozen}
             />
        </T.Group>

        <!-- The Rack (Positioned "in front" at Z+) -->
        {#each rack as tile, i (tile.id)}
            <!-- 2 Rows of 4 Tiles -->
            {@const row = Math.floor(i / 4)}
            {@const col = i % 4}
            
            {@const x = (col - 1.5) * TILE_SPACING} 
            <!-- Apply rackTileOffsetZ here -->
            {@const z = RACK_Z_OFFSET + (row * TILE_SPACING) + rackTileOffsetZ}
            
            {@const isDragging = draggingId === tile.id}

            {#if !isDragging}
                <Tile3D 
                    position={[x, RACK_Y_OFFSET, z]}
                    rotation={[-Math.PI / 2, 0, 0]} 
                    letter={tile.letter} 
                    value={tile.value}
                    scale={1.8}
                    color={debugColor}
                    opacity={debugOpacity}
                    on:pointerdown={handlePointerDown.bind(null, tile.id)}
                />
            {/if}
        {/each}
        
        <!-- Ghost Tile (Unified) -->
        {#if draggingId && ghostPos}
             {@const tile = getGhostTile(draggingId)}
             {#if tile}
                 <Tile3D 
                    position={ghostPos}
                    rotation={[-Math.PI / 2, 0, 0]} 
                    letter={tile.letter} 
                    value={tile.value}
                    scale={$dragScale}
                    color={debugColor}
                    opacity={debugOpacity}
                    {frozen}
                 />
             {/if}
        {/if}

        <!-- Interaction Plane (Covers entire playspace) -->
        <!-- Logic: When dragging, move plane ABOVE tiles (Y=2) so it captures all events reliably.
             When not dragging, move plane FAR BELOW (Y=-10) to ensure it never blocks clicks. -->
        <T.Mesh 
            rotation={[-Math.PI / 2, 0, 0]} 
            position={[0, draggingId ? 2.0 : -10.0, 0]}
            on:pointermove={handlePointerMove}
            on:pointerup={handlePointerUp}
            interactive={true}
        >
             <T.PlaneGeometry args={[60, 60]} /> 
             <T.MeshBasicMaterial transparent opacity={0.0} depthWrite={false} />
        </T.Mesh>

    </Scene>
  </Canvas>
  {/if}
  
  <!-- Content for E2E Testing Only (Hidden from user, visible to DOM scanner) -->
  <div class="test-proxies" style="position: absolute; width: 0; height: 0; overflow: hidden; pointer-events: none;">
    {#each Object.values(board) as tile (tile.id)}
       <div data-testid="board-tile" data-letter={tile.letter} data-value={tile.value}></div>
    {/each}
    {#each rack as tile (tile.id)}
       <div data-testid="rack-tile" data-letter={tile.letter} data-value={tile.value}></div>
    {/each}
  </div>
</div>

<style>
  .game-wrapper {
    width: 100%;
    height: 100%; /* Fill container */
    overflow: hidden;
    position: relative;
    position: relative;
    /* Background handled inline for frozen support */
  }
</style>
