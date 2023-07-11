import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    redirect: '/login',
    meta: {
      showTab: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      showTab: true
    }
  },
]
const router = new VueRouter({
  scrollBehavior: () => ({ y: 0 }),
  routes
})

router.afterEach((to, from) => { })

export default router