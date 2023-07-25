<script setup lang="ts">
import { ref } from 'vue'
import variables from '@/styles/variables.module.scss'
import { useCounterStore } from '@/store/counter'

const store = useCounterStore()
console.log(store.double, 132123)
defineProps<{ msg: string }>()

const count = ref(0)

console.log(variables.bgColor)
</script>

<template>
  <h1>{{ msg }}</h1>
  <div class="box" />
  <el-button type="info"
    ><svg-icon icon-class="danger" />SVG 本地图标</el-button
  >
  <div class="card">
    <button type="button" @click="count++">count is {{ store.count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Install
    <a href="https://github.com/vuejs/language-tools" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style lang="scss" scoped>
.read-the-docs {
  color: #888;
}
// .box {
//   width: 100px;
//   height: 100px;
//   background-color: $bg-color;
// }
</style>
