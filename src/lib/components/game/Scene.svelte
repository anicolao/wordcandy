<script>
  import { T } from '@threlte/core';
  import { onMount } from 'svelte';
  import { OrbitControls } from '@threlte/extras';

  export let gridSize = 15;
  export let rackMode = false;

  onMount(() => {
    console.log('SCENE MOUNTED', { rackMode });
  });
</script>

{#if !rackMode}
    <T.PerspectiveCamera makeDefault position={[0, 15, 10]} fov={50} />
{:else}
    <T.PerspectiveCamera 
        makeDefault 
        position={[0, 8, 12]} 
        fov={45} 
        on:create={({ ref }) => ref.lookAt(0, 0, 0)}
    >
        <OrbitControls enableDamping target={[0, 0, 0]} />
    </T.PerspectiveCamera>
{/if}

<!-- Key Light (Warm) -->
<T.DirectionalLight position={[5, 10, 5]} intensity={4.0} castShadow color="#fff0dd"/>
<!-- Fill Light (Cool) -->
<T.DirectionalLight position={[-8, 5, -5]} intensity={3.0} color="#cceeff" />
<!-- Rim Light (Sharp Cyan) -->
<T.SpotLight position={[0, 8, -5]} intensity={10.0} color="#00ffcc" angle={0.5} penumbra={0.5} decay={0} distance={20} />
<T.AmbientLight intensity={1.0} />

<!-- Refraction Background: GridHelper for visual distortion -->
<T.Group position={[0, -1, -2]} rotation={[0, 0, 0]}>
    <T.GridHelper args={[30, 30, 0x444444, 0x222222]} rotation={[Math.PI/4, 0, 0]} />
</T.Group>

<!-- Environment for gloss reflections -->
<T.Mesh position={[0, 10, -10]}>
    <T.SphereGeometry args={[5, 32, 32]} />
    <T.MeshBasicMaterial color="#ffffff" />
</T.Mesh>

<slot />

