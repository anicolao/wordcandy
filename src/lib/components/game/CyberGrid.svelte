<script>
  import { T, useTask } from '@threlte/core';
  import { Color, DoubleSide } from 'three';

  export let gridSize = 40;
  export let divisions = 40;
  export let color = '#00ffff';
  export let backgroundColor = '#1a1a1a';

  let time = 0;

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColor;
    uniform vec3 uBgColor;
    uniform float uGridSize;
    
    varying vec2 vUv;

    // Pseudo-random function
    float hash(float n) { return fract(sin(n) * 43758.5453123); }
    float noise(float p) {
        float fl = floor(p);
        float fc = fract(p);
        return mix(hash(fl), hash(fl + 1.0), fc);
    }

    void main() {
        // Grid lines (UV space 0..1, scaled by grid size)
        vec2 gridUV = vUv * uGridSize;
        vec2 gridFract = fract(gridUV);
        
        // Thickness of lines (0.05 of a cell)
        float lineThickness = 0.05;
        
        // Base Grid
        float linesX = step(1.0 - lineThickness, gridFract.x);
        float linesY = step(1.0 - lineThickness, gridFract.y);
        float grid = max(linesX, linesY);
        
        // Sparks Logic
        float sparkInterest = 0.0;
        
        // Horizontal Sparks (move along X, distinct Y lines)
        float lineIdY = floor(gridUV.y);
        // Randomize speed and start time per line
        float randomOffset = hash(lineIdY * 12.34);
        float speed = 1.0 + hash(lineIdY * 45.67);
        
        // Cycle: Spark every ~3-5 seconds
        float cycleDur = 3.0 + randomOffset * 2.0;
        float localTime = uTime + randomOffset * 10.0;
        float cyclePhase = mod(localTime, cycleDur);
        
        // If in active phase (first 1.2s)
        if (cyclePhase < 1.2) {
             float progress = cyclePhase / 1.2; // 0 to 1 over 1.2s
             float sparkPos = progress * uGridSize; // Move across grid
             
             // Distance from current pixel X to spark head
             float dist = gridUV.x - sparkPos;
             
             // Tail length 2.0 cells
             if (dist < 0.0 && dist > -5.0) {
                 float intensity = 1.0 - (abs(dist) / 5.0);
                 sparkInterest += intensity * linesY; // Only light up the horizontal line
             }
        }
        
        // Vertical Sparks (move along Y, distinct X lines)
        float lineIdX = floor(gridUV.x);
        float randomOffsetX = hash(lineIdX * 67.89);
        float cycleDurX = 4.0 + randomOffsetX * 3.0;
        float localTimeX = uTime + randomOffsetX * 10.0;
        float cyclePhaseX = mod(localTimeX, cycleDurX);
        
        if (cyclePhaseX < 1.4) {
             float progress = cyclePhaseX / 1.4;
             float sparkPos = progress * uGridSize;
             float dist = gridUV.y - sparkPos;
             if (dist < 0.0 && dist > -5.0) {
                 float intensity = 1.0 - (abs(dist) / 5.0);
                 sparkInterest += intensity * linesX;
             }
        }

        // Compostion
        vec3 finalColor = mix(uBgColor, uColor, grid * 0.3); // Dim base grid
        finalColor += uColor * sparkInterest * 2.0; // Bright sparks (HDR-ish)

        gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  useTask((delta) => {
    time += delta;
  });
</script>

<T.Mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, -5]}>
  <T.PlaneGeometry args={[60, 60]} />
  <T.ShaderMaterial
    {vertexShader}
    {fragmentShader}
    uniforms={{
      uTime: { value: 0 },
      uColor: { value: new Color(color) },
      uBgColor: { value: new Color(backgroundColor) },
      uGridSize: { value: divisions }
    }}
    uniforms.uTime.value={time}
  />
</T.Mesh>
