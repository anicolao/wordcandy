<script>
  import { T } from '@threlte/core';
  import { OrbitControls, Grid } from '@threlte/extras';

  export let gridSize = 15;
</script>

<T.PerspectiveCamera makeDefault position={[0, 15, 10]} fov={50}>
  <OrbitControls enableZoom={true} enablePan={true} maxPolarAngle={Math.PI / 2} />
</T.PerspectiveCamera>

<T.DirectionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
<T.AmbientLight intensity={0.5} />

<!-- Neon Grid -->
<Grid 
    position={[0, -0.01, 0]}
    args={[20, 20]} 
    cellColor="#00f0ff" 
    sectionColor="#00f0ff" 
    sectionThickness={1.5}
    fadeDistance={25}
/>

<!-- Example Center Star -->
<T.Mesh position={[0, 0.1, 0]} rotation.x={-Math.PI / 2}>
    <T.PlaneGeometry args={[1, 1]} />
    <T.MeshBasicMaterial color="yellow" transparent opacity={0.5} />
</T.Mesh>
