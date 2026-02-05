<script lang="ts">
  import { T } from '@threlte/core';
  import { Text } from '@threlte/extras';
  import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
  import { createEventDispatcher } from 'svelte';

  export let letter = '';
  export let value = 0;
  export let position: [number, number, number] = [0, 0, 0];
  export let rotation: [number, number, number] = [0, 0, 0];
  export let scale: number | [number, number, number] = 1;
  export let color = "#FFE135"; // Default Banana Yellow
  export let opacity = 0.2; // Default Inner Glow Opacity
  export let frozen: string | null = null;

  const thickness = 0.425;
  const roughness = 0.2;

  const dispatch = createEventDispatcher();

  // Reactive material props to ensure updates work
  $: materialOpacity = Number(opacity);
  $: transmission = 1 - materialOpacity; 

  // Thicker "Hard Candy" geometry with rounder corners
  // Radius reduced to 0.12 for "sharper dropoff" as requested
  // Thickness reduced by 15% (0.5 -> 0.425)
  const geometry = new RoundedBoxGeometry(1.1, 1.1, 0.425, 8, 0.12);
</script>

<T.Group {position} {rotation} {scale} {...$$restProps}>
  <!-- Glassy Base -->
  <T.Mesh
    {geometry}
    interactive
    on:pointerdown={(e) => dispatch('pointerdown', e)}
  >
    {#if frozen}
      <!-- Frozen Mode: Deterministic Matte Standard Material (Solid, Visible, No Reflection) -->
      <T.MeshStandardMaterial
        color="#cccccc"
        roughness={1.0}
        metalness={0.0}
      />
    {:else}
      <!-- Game Mode: High Fidelity Physical Material -->
      <T.MeshPhysicalMaterial 
        color={color} 
        transmission={transmission} 
        thickness={thickness} 
        roughness={roughness}
        ior={1.5}
        envMapIntensity={2.0}
        attenuationColor={color}
        attenuationDistance={1.2}
        clearcoat={1.0}
        clearcoatRoughness={0.1}
        transparent
        opacity={1}
      />
    {/if}
  </T.Mesh>

  <!-- Letter: On Surface & Bold -->
  <!-- Surface Z calculation: 0.425 / 2 = 0.2125. Placed at 0.225 for slight relief -->
  <Text
    text={letter}
    position={[0, 0.05, 0.26]} 
    fontSize={0.65}
    fontWeight="bold"
    color="#000000"
    anchorX="center"
    anchorY="middle"
    depth={0.05}
  />
  
  <!-- Value: Bottom Right -->
  {#if value > 0}
  <Text
    text={String(value)}
    position={[0.3, -0.3, 0.26]}
    fontSize={0.25}
    fontWeight="bold"
    color="#000000"
    anchorX="center"
    anchorY="middle"
    depth={0.05}
  />
  {/if}
</T.Group>

