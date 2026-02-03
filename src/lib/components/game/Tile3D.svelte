<script>
  import { T } from '@threlte/core';
  import { Text } from '@threlte/extras';
  import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

  export let letter = '';
  export let value = 0;
  export let position = [0, 0, 0];
  export let rotation = [0, 0, 0];
  export let scale = 1;
  export let color = "#FFE135"; // Default Banana Yellow
  export let opacity = 0.4; // Default Inner Glow Opacity

  // Reactive material props to ensure updates work
  $: materialOpacity = Number(opacity);

  // Thicker "Hard Candy" geometry with rounder corners
  // Radius reduced to 0.12 for "sharper dropoff" as requested
  // Thickness reduced by 15% (0.5 -> 0.425)
  const geometry = new RoundedBoxGeometry(1.1, 1.1, 0.425, 8, 0.12);
</script>

<T.Group {position} {rotation} {scale}>
  <!-- INNER GLOW: Simulates the "gummy" center -->
  <T.Mesh>
    <T.BoxGeometry args={[0.8, 0.8, 0.3]} />
    <T.MeshBasicMaterial {color} transparent opacity={materialOpacity} />
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
      attenuationColor={color}
      attenuationDistance={1.2}
      clearcoat={1.0}
      clearcoatRoughness={0.0}
      envMapIntensity={2.0}
    />
  </T.Mesh>

  <!-- Letter: On Surface & Bold -->
  <!-- Surface Z calculation: 0.425 / 2 = 0.2125. Placed at 0.225 for slight relief -->
  <Text
    text={letter}
    position={[0, 0.05, 0.225]} 
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
    position={[0.3, -0.3, 0.225]}
    fontSize={0.25}
    fontWeight="bold"
    color="#000000"
    anchorX="center"
    anchorY="middle"
    depth={0.05}
  />
</T.Group>
