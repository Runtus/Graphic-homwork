<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import Graph from './components/graph/graph.vue'
import { Input, Button } from 'ant-design-vue'
import { ref } from 'vue'
const inputValue = ref("")
const isDisabled = ref(false)
const seq = ref<number[]>([])

function onClick() {
  console.log("触发", seq.value)
  graphRef.value.render(seq.value)
}

const graphRef = ref<any>()


const onChange = (e: any) => {
  const value = (e.target.value as string).split(",");
  console.log(value)
  if (value.findIndex(item => isNaN(Number(item))) !== -1) {
    isDisabled.value = true
  } else {
    isDisabled.value = false;
    seq.value = [...value.map(item => Number(item))]
  }
}

</script>

<template>
  <div id="app-vue">
    <div class="tools">
      <Input class="input" v-model:value="inputValue" @change="onChange" />
      <Button class="btn"  @click="onClick" :disabled="isDisabled">
        生成
      </Button>
    </div>
    <Graph ref="graphRef" />
  </div>
  <!-- <HelloWorld msg="Electron + Vite + Vue" /> -->
</template>

<style >
#app-vue{
  width: 100%;
}

.tools {
  margin: 20px;
}

.btn {
  margin-top: 12px;
}


.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo.electron:hover {
  filter: drop-shadow(0 0 2em #9FEAF9);
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
