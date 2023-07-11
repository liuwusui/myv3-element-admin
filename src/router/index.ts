import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { hidden: true }
  }
]
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes as RouteRecordRaw[]
})
/**
 * 重置路由
 */
export function resetRouter() {
  router.replace({ path: '/login' })
}

export default router
