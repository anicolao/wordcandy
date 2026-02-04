<script lang="ts">
  import { T, useTask, useThrelte } from '@threlte/core';
  import { Color, Vector2, Vector3, Raycaster } from 'three';
  import { interactivity } from '@threlte/extras';
  import Tile3D from './Tile3D.svelte';
  import { store, stopDrag } from '../../store';
  import { placeTile } from '../../reducers/game';

  interactivity();

  export let gridSize = 40; // Size of the visible plane (large)
  export let cellSpacing = 1.25; // Snug fit for 1.1 size tiles
  export let color = '#00ffff'; 
  export let radius = 3.75; // reduced to match tighter grid

  let planeMesh: any;
  let material: any;
  const { camera, invalidate } = useThrelte();
  const raycaster = new Raycaster();
  
  // Drag State
  $: draggingId = $store.drag.draggingTileId;

  let ghostPos: [number, number, number] | null = null;
  let ghostGrid: [number, number] | null = null;

  // Shader
  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vWorldPos;
    void main() {
      vUv = uv;
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPos = worldPosition.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `;

  const fragmentShader = `
    uniform vec3 uColor;
    uniform vec2 uPointerPos;
    uniform float uRadius;
    uniform float uSpacing;
    uniform float uThickness;
    
    varying vec2 vUv;
    varying vec3 vWorldPos;

    void main() {
      // 1. Grid Lines
      vec2 grid = abs(fract(vWorldPos.xz / uSpacing - 0.5) - 0.5) / fwidth(vWorldPos.xz / uSpacing);
      float line = 1.0 - min(min(grid.x, grid.y), 1.0);
      
      // 2. Distance Mask (Glow Radius)
      float dist = distance(vWorldPos.xz, uPointerPos);
      float alpha = 1.0 - smoothstep(uRadius * 0.5, uRadius, dist);
      
      // 3. Combine
      vec3 finalColor = uColor;
      
      // Base visibility (0.15) + Glow (alpha)
      float visibility = 0.15 + alpha;
      
      float strength = line * visibility;
      float bgGlow = (1.0 - smoothstep(0.0, uRadius * 1.5, dist)) * 0.1;

      gl_FragColor = vec4(finalColor, strength + bgGlow);
    }
  `;

  const uColorValue = new Color(color);
  $: uColorValue.set(color);

  function handlePointerMove(e: any) {
    let hit = false;
    let x = 0;
    let z = 0;
    
    // 1. Try Threlte's event point first
    if (e.point && (e.point.x !== 0 || e.point.z !== 0)) {
       x = e.point.x;
       z = e.point.z;
       hit = true;
    }

    // 2. Fallback to Manual Raycasting
    if (!hit && e.pointer && $camera && planeMesh) {
        raycaster.setFromCamera(e.pointer, $camera);
        const intersects = raycaster.intersectObject(planeMesh);
        if (intersects.length > 0) {
             const p = intersects[0].point;
             x = p.x;
             z = p.z;
             hit = true;
        }
    }

    if (hit) {
        // console.log('Pointer Hit:', x, z); // Too noisy? Maybe log once per second? 
        // Update Shader Uniform
        if (material) {
            material.uniforms.uPointerPos.value.set(x, z);
        }
        
        // Always calculate grid position
        const gridX = Math.floor(x / cellSpacing);
        const gridY = Math.floor(z / cellSpacing);
        ghostGrid = [gridX, gridY];

        // Update Ghost Tile Logic
        if (draggingId) {
            ghostPos = [
                (gridX + 0.5) * cellSpacing,
                0.17,
                (gridY + 0.5) * cellSpacing
            ];
        } else {
            ghostPos = null;
            // ghostGrid = null; // Don't reset grid if not dragging, so we can click
        }

        invalidate();
    }
  }
  
  function handlePointerUp(e: any) {
    let hitX = 0;
    let hitZ = 0;
    let hasHit = false;

    // 1. Try Event Point
    if (e.point) {
        hitX = e.point.x;
        hitZ = e.point.z;
        hasHit = true;
    } 
    // 2. Fallback to Raycaster (if needed, though e.point from Threlte should usually exist on interaction)
    else if (e.pointer && $camera && planeMesh) {
         raycaster.setFromCamera(e.pointer, $camera);
         const intersects = raycaster.intersectObject(planeMesh);
         if (intersects.length > 0) {
             const p = intersects[0].point;
             hitX = p.x;
             hitZ = p.z;
             hasHit = true;
         }
    }

    if (hasHit) {
        e.stopPropagation();
        const gridX = Math.floor(hitX / cellSpacing);
        const gridY = Math.floor(hitZ / cellSpacing);
        
        let tileIdToPlace = draggingId;

        // Fallback: If not dragging, pick first tile from rack
        if (!tileIdToPlace) {
             const player = $store.game.players[$store.auth.uid];
             if (player && player.rack.length > 0) {
                 tileIdToPlace = player.rack[0].id;
             }
        }
        
        if (tileIdToPlace) {
            store.dispatch(placeTile({
                tileId: tileIdToPlace,
                x: gridX,
                y: gridY
            }));
        }
        
        if (draggingId) {
             store.dispatch(stopDrag());
        }
        
        ghostPos = null;
        ghostGrid = null;
    }
  }

  function handlePointerLeave() {
     if (material) {
        material.uniforms.uPointerPos.value.set(9999, 9999);
     }
     if (draggingId) {
         ghostPos = null; // hide ghost if off board
         ghostGrid = null;
     }
     invalidate();
  }

  // Stabilize Uniforms Reference
  const uniforms = {
     uColor: { value: uColorValue },
     uPointerPos: { value: new Vector2(9999, 9999) },
     uRadius: { value: radius },
     uSpacing: { value: cellSpacing },
     uThickness: { value: 0.05 }
  };

  // FORCE RENDER LOOP: Threlte raycasting requires an active loop to detect pointer moves.
  // Without this (or working frameloop="always"), the raycaster sleeps and hover events are missed.
  useTask(() => {
    // Intentionally empty or minimal - just existence keeps the loop scheduler code active in some Threlte versions,
    // or we can explicitely invalidate() if needed, but usually just having a task is enough to opt-in if 'demand' is acting up.
    // However, to be absolutely sure:
    invalidate(); 
  });
</script>

<!-- Render Placed Tiles -->
{#each Object.entries($store.game.board) as [key, tile] (tile.id)}
    {@const [gridX, gridY] = key.split(',').map(Number)}
    {@const posX = (gridX + 0.5) * cellSpacing}
    {@const posZ = (gridY + 0.5) * cellSpacing}
    <Tile3D
        position={[posX, 0.17, posZ]}
        rotation={[-Math.PI / 2, 0, 0]}
        letter={tile.letter}
        value={tile.value}
    />
{/each}

<!-- Render Ghost Tile -->
{#if draggingId && ghostPos}
    {@const player = $store.game.players[$store.auth.uid]}
    {@const tile = player?.rack.find(t => t.id === draggingId)}
    {#if tile}
        <Tile3D
            position={ghostPos}
            rotation={[-Math.PI / 2, 0, 0]}
            letter={tile.letter}
            value={tile.value}
            opacity={0.5} 
            color="#ffffff"
            scale={1.0}
        />
    {/if}
{/if}

<!-- Large plane, flat on XZ -->
<T.Mesh 
    rotation={[-Math.PI / 2, 0, 0]} 
    position={[0, -0.05, 0]} 
    on:pointermove={handlePointerMove}
    on:pointerup={handlePointerUp}
    on:pointerleave={handlePointerLeave}
    bind:ref={planeMesh}
>
  <T.PlaneGeometry args={[gridSize * cellSpacing * 2, gridSize * cellSpacing * 2]} />
  <T.ShaderMaterial
    bind:ref={material}
    {vertexShader}
    {fragmentShader}
    transparent
    {uniforms}
  />
</T.Mesh>
