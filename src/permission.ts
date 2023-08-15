import router from '@/router'
import { useUserStoreHook } from '@/store/modules/user'
import { usePermissionStoreHook } from '@/store/modules/permission'

// import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// NProgress.configure({ showSpinner: false }) // 进度条

const permissionStore = usePermissionStoreHook()

// 白名单路由
const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
  const hasToken = localStorage.getItem('accessToken')
  if (hasToken) {
    // 有token，去登录页 跳转首页
    if (to.path === '/login') {
      // 如果已登录，跳转首页
      next({ path: '/' })
    } else {
      // 有token，不去登录页，判断权限
      const userStore = useUserStoreHook()
      const hasRoles = userStore.roles && userStore.roles.length > 0
      console.log(userStore.roles, 'userStore.roles')
      console.log(hasRoles)
      if (hasRoles) {
        // 未匹配到任何路由，跳转404
        if (to.matched.length === 0) {
          from.name ? next({ name: from.name }) : next('/404')
        } else {
          next()
        }
      } else {
        console.log(123123123, hasRoles)
        try {
        const { roles } = await userStore.getInfo()
        console.log(roles, 222233331231)
        const accessRoutes = await permissionStore.generateRoutes(roles)
        console.log(accessRoutes)
        accessRoutes.forEach((route) => {
          router.addRoute(route)
        })
        console.log(router)
        next({ ...to, replace: true })
        } catch (error) {
          // 移除 token 并跳转登录页
          await userStore.resetToken();
          next(`/login?redirect=${to.path}`);
          // NProgress.done();
        }
      }
    }
  } else {
    // 未登录可以访问白名单页面
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      // NProgress.done()
    }
  }
})

router.afterEach(() => {
  // NProgress.done()
})
