<script>
  import { T } from '@threlte/core';
  import { Text } from '@threlte/extras';
  import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

  export let letter = '';
  export let value = 0;
  export let position = [0, 0, 0];
  export let rotation = [0, 0, 0];
  export let scale = 1;

  // Thicker "Hard Candy" geometry with rounder corners
  const geometry = new RoundedBoxGeometry(1.1, 1.1, 0.5, 4, 0.25);
</script>

<T.Group {position} {rotation} {scale}>
  <!-- INNER GLOW: Simulates the "gummy" center -->
  <T.Mesh>
    <T.BoxGeometry args={[0.8, 0.8, 0.3]} />
    <T.MeshBasicMaterial color="#FFE135" transparent opacity={0.4} />
  </T.Mesh>

  <!-- Tile Base: High Refraction Acrylic -->
  <T.Mesh {geometry}>
    <T.MeshPhysicalMaterial
      color="#ffffff"
      transmission={0.99}
      opacity={1}
      metalness={0.0}
      roughness={0.0}
      ior={1.5}
      thickness={1.5}
      attenuationColor="#FFE135"
      attenuationDistance={1.2}
      clearcoat={1.0}
      clearcoatRoughness={0.0}
      envMapIntensity={2.0}
    />
  </T.Mesh>

  <!-- Letter: On Surface & Bold -->
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

  <!-- Value: Bottom Right (Moved Inward) -->
  <Text
    text={value.toString()}
    position={[0.3, -0.3, 0.26]}
    fontSize={0.25}
    fontWeight="bold"
    color="#000000"
    anchorX="center"
    anchorY="middle"
    depth={0.05}
  />
</T.Group>
