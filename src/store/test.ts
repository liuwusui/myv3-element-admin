// pinia 文档 state
import { defineStore } from 'pinia'
const useStore = defineStore('storeId', () => {
  state: () => {
    return {
      count: 0,
      name: 'lws',
      isAdmin: true,
      items: [],
      hasChanged: true
    }
  }
})

export {useStore}