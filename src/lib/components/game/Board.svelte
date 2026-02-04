<script>
  import { Canvas } from '@threlte/core';
  import Scene from './Scene.svelte';
  import InfiniteBoard from './InfiniteBoard.svelte';
</script>

<div class="board-wrapper glass-panel">
  <Canvas frameloop="always">
    <Scene rackMode={false} showGrid={false} enableControls={false}>
      <InfiniteBoard />
    </Scene>
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
