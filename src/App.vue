<script setup lang="ts">
import HelloWord from '@/components/HelloWorld.vue'
// import { ElConfigProvider } from 'element-plus'
// import { useAppStore } from '@/store/modules/app'
// const appStore = useAppStore()
</script>

<template>
  <HelloWord :msg="'热烈'"></HelloWord>

  <el-row class="mb-4">
    <el-button type="info">Info</el-button>
    <el-button type="warning">热烈一夏</el-button>
    <el-button type="danger">Danger</el-button>
  </el-row>
  <router-view />
</template>
