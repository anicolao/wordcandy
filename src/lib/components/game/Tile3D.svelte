<script lang="ts">
  import { T } from '@threlte/core';
  import { Text } from '@threlte/extras';
  import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

  export let letter = '';
  export let value = 0;
  export let position: [number, number, number] = [0, 0, 0];
  export let rotation: [number, number, number] = [0, 0, 0];
  export let scale: number | [number, number, number] = 1;
  export let color = "#FFE135"; // Default Banana Yellow
  export let opacity = 0.2; // Default Inner Glow Opacity
  export let intensity = 0.5; // Default Internal Light Intensity

  // Reactive material props to ensure updates work
  $: materialOpacity = Number(opacity);
  $: transmission = 1 - materialOpacity; // Opacity 1 = Solid (0 trans), Opacity 0 = Clear (1 trans)

  // Thicker "Hard Candy" geometry with rounder corners
  // Radius reduced to 0.12 for "sharper dropoff" as requested
  // Thickness reduced by 15% (0.5 -> 0.425)
  const geometry = new RoundedBoxGeometry(1.1, 1.1, 0.425, 8, 0.12);
</script>

<T.Group {position} {rotation} {scale} {...$$restProps}>
  <!-- INNER GLOW: Simulates the "gummy" center -->
  <T.Mesh>
    <T.BoxGeometry args={[0.8, 0.8, 0.3]} />
    <T.MeshBasicMaterial {color} transparent opacity={materialOpacity} />
  </T.Mesh>

  <!-- Tile Base: High Refraction Acrylic -->
  <!-- Transmission controls "glassiness". High Opacity = Low Transmission -->
  <T.Mesh {geometry}>
    <T.MeshPhysicalMaterial
      color={color}
      transmission={transmission}
      opacity={1}
      metalness={0.0}
      roughness={0.1}
      ior={1.5}
      thickness={1.5}
      attenuationColor={color}
      attenuationDistance={1.2}
      clearcoat={1.0}
      clearcoatRoughness={0.1}
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
