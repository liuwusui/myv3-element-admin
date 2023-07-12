import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  // ref变量 → state 属性
  const count = ref(2)
  // computed计算属性 → getters
  const double = computed(() => {
    return count.value * 2
  })
  // function函数 → actions
  function increment() {
    count.value=count.value+10
  }
  return { count, increment, double }
})


/* 
  在 Setup Store 中：
      ref() 就是 state 属性
      computed() 就是 getters
      function() 就是 actions
*/
