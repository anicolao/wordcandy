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
  
  // Controlled Prop from Parent (UnifiedGame)
  export let pointerPos: { x: number, z: number } = { x: 9999, z: 9999 };

  let planeMesh: any;
  let material: any;
  const { camera, invalidate } = useThrelte(); // Still need invalidate for shader updates? Or parent handles it?
  // If parent invalidates loop, we might not need it here, but safe to keep if uniform updates don't auto-trigger.

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

  // React to prop changes
  $: if (material) {
      material.uniforms.uPointerPos.value.set(pointerPos.x, pointerPos.z);
      invalidate(); // Ensure frame renders new uniform
  }

  // Stabilize Uniforms Reference
  const uniforms = {
     uColor: { value: uColorValue },
     uPointerPos: { value: new Vector2(9999, 9999) },
     uRadius: { value: radius },
     uSpacing: { value: cellSpacing },
     uThickness: { value: 0.05 }
  };
</script>

<!-- Render Placed Tiles MOVED TO UnifiedGame.svelte -->
<!-- InfiniteBoard is now just the visual grid plane -->

<!-- Visual-Only Plane (Parameters controlled by Parent) -->
<T.Mesh 
    rotation={[-Math.PI / 2, 0, 0]} 
    position={[0, -0.05, 0]} 
    bind:ref={planeMesh}
    interactive={false}
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
