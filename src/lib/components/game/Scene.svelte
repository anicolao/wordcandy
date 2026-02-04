<script lang="ts">
  import { T } from '@threlte/core';
  import { onMount } from 'svelte';
  import { OrbitControls } from '@threlte/extras';
  import CyberGrid from './CyberGrid.svelte';

  export let gridSize = 15;
  export let rackMode = false;
  export let frozen: string | null = null; // Pass frozen time down
  
  // Camera Controls
  export let cameraPosition: [number, number, number] = [0, 15, 0.1];
  export let cameraFov = 20;
  export let cameraLookAt: [number, number, number] = [0, 0, 0];
  export let enableControls = false;

  // Debug Controls
  export let gridColor = '#00ffff';
  export let gridBackgroundColor = '#2a2a2a';
  export let lightIntensity = 4.0;
  export let showGrid = true; // Default to true (Rack)

  onMount(() => {
    console.log('SCENE MOUNTED', { rackMode, cameraPosition, cameraFov });
  });
</script>

{#if !rackMode}
    <!-- Board Camera: Top Down -->
    <T.PerspectiveCamera 
        makeDefault 
        position={[0, 40, 0]} 
        fov={50} 
        on:create={({ ref }) => ref.lookAt(0, 0, 0)}
    >
        {#if enableControls}
            <OrbitControls enableDamping target={[0,0,0]} />
        {/if}
    </T.PerspectiveCamera>
{:else}
    <!-- Rack Camera: Angled -->
    <T.PerspectiveCamera 
        makeDefault 
        position={cameraPosition} 
        fov={cameraFov}
        on:create={({ ref }) => {
            ref.lookAt(...cameraLookAt);
        }}
    >
        {#if enableControls}
            <OrbitControls 
                enableDamping 
                target={cameraLookAt} 
                on:change={({ target }) => {
                    const cam = target.object;
                    cameraPosition = [cam.position.x, cam.position.y, cam.position.z];
                    if (cam.fov) cameraFov = cam.fov;
                }}
            />
        {/if}
    </T.PerspectiveCamera>
{/if}

<!-- Key Light (Warm) -->
<T.DirectionalLight position={[5, 10, 5]} intensity={lightIntensity} castShadow color="#fff0dd"/>
<!-- Fill Light (Cool) -->
<T.DirectionalLight position={[-8, 5, -5]} intensity={3.0} color="#cceeff" />
<!-- Rim Light (Sharp Cyan) -->
<T.SpotLight position={[0, 8, -5]} intensity={10.0} color="#00ffcc" angle={0.5} penumbra={0.5} decay={0} distance={20} />
<T.AmbientLight intensity={1.0} />

<!-- Cyber Background & Grid (Slightly below tiles at Y=0) -->
{#if showGrid}
    <T.Group position={[0, -2, 0]}>
        <CyberGrid color={gridColor} backgroundColor={gridBackgroundColor} {frozen} />
    </T.Group>
{/if}

<!-- Environment for gloss reflections (Rack only) -->
{#if rackMode}
    <T.Mesh position={[0, 10, -10]}>
        <T.SphereGeometry args={[5, 32, 32]} />
        <T.MeshBasicMaterial color="#ffffff" />
    </T.Mesh>
{/if}

<slot />

