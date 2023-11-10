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
  console.log(hasToken, 'hasToken')
  if (hasToken) {
    // 有token，去登录页 跳转首页
    if (to.path === '/login') {
      // 如果已登录，跳转首页
      next({ path: '/' })
    } else {
      // 有token，不去登录页，判断权限
      const userStore = useUserStoreHook()
      // console.log(userStore, 888999)
      const hasRoles = userStore.roles && userStore.roles.length > 0
      console.log(userStore.roles, 'userStore.roles') // ADMIN
      console.log(hasRoles)
      if (hasRoles) {
        // true
        // 未匹配到任何路由，跳转404
        console.log(to)
        if (to.matched.length === 0) {
          from.name ? next({ name: from.name }) : next('/404')
        } else {
          next()
        }
      } else {
        // console.log(123123123, hasRoles)
        try {
          const { roles } = await userStore.getInfo()
          // console.log(roles)
          const accessRoutes = await permissionStore.generateRoutes([roles])
          accessRoutes.forEach((route) => {
            // console.log(route, 99999999)
            router.addRoute(route)
          })
          next({ ...to, replace: true })
        } catch (error) {
          // 移除 token 并跳转登录页
          console.log(error)
          await userStore.resetToken()
          next(`/login?redirect=${to.path}`)
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
