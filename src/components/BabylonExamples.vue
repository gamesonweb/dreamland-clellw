<template>
  
  <div>
    <canvas></canvas>
  </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {IntroCutscene} from '@/BabylonExamples/IntroCutscene';

export default defineComponent({
  name: 'BabylonExamples',
  mounted() {
    const canvas = document.querySelector("canvas")!;
    new IntroCutscene(canvas);
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

canvas {
  display: block;
  width: 80%;
  height: 80%;
  touch-action: none;
  margin: auto;
  overflow: hidden;
}

body {
  overflow: hidden;
  width: 100%;
  height: 100%;
  padding : 0px;
  margin: 0px;
}
</style>
