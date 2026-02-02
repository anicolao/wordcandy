<script>
  import { Canvas } from '@threlte/core';
  import Scene from './Scene.svelte';
</script>

<div class="board-wrapper glass-panel">
  <Canvas>
    <Scene />
  </Canvas>
</div>

<style>
  .board-wrapper {
    width: 100%;
    height: 60vh;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    background: radial-gradient(circle at center, #111, #000);
  }
</style>
