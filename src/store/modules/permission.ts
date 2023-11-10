import { RouteRecordRaw } from 'vue-router'
import { defineStore } from 'pinia'
import { constantRoutes } from '@/router'
import { store } from '@/store'
import { listRoutes } from '@/api/menu'

const modules = import.meta.glob('../../views/**/**.vue')
const Layout = () => import('@/layout/index.vue')

/**
 * Use meta.role to determine if the current user has permission
 *
 * @param roles 用户角色集合
 * @param route 路由
 * @returns
 */
const hasPermission = (roles: string[], route: RouteRecordRaw) => {
  // console.log(roles, route, 1989189)
  if (route.meta && route.meta.roles) {
    // 角色【超级管理员】拥有所有权限，忽略校验
    if (roles.includes('ROOT')) {
      return true
    }
    return roles.some((role) => {
      // console.log(route.meta?.roles as string[], role, 999999)
      if (route.meta?.roles !== undefined) {
        return (route.meta.roles as string[]).includes(role[0])
      }
    })
  }
  return true
}

/**
 * 递归过滤有权限的异步(动态)路由
 *
 * @param routes 接口返回的异步(动态)路由
 * @param roles 用户角色集合
 * @returns 返回用户有权限的异步(动态)路由
 */
const filterAsyncRoutes = (routes: RouteRecordRaw[], roles: string[]) => {
  const asyncRoutes: RouteRecordRaw[] = []
  console.log(routes, roles, 88888888)

  routes.forEach((route) => {
    const tmpRoute = { ...route } // ES6扩展运算符复制新对象
    console.log(tmpRoute)
    // 判断用户(角色)是否有该路由的访问权限
    // console.log(hasPermission(roles, tmpRoute), 100000000123) //true
    if (hasPermission(roles, tmpRoute)) {
      // console.log(roles, tmpRoute, 9999)
      console.log(tmpRoute.component)
      if (tmpRoute.component?.toString() == 'Layout') {
        tmpRoute.component = Layout
      } else {
        console.log(tmpRoute.component)
        const component = modules[`../../views/${tmpRoute.component}.vue`]
        // console.log(tmpRoute.component)
        if (component) {
          tmpRoute.component = component
        } else {
          tmpRoute.component = modules[`../../views/error-page/404.vue`]
        }
      }

      if (tmpRoute.children) {
        tmpRoute.children = filterAsyncRoutes(tmpRoute.children, roles)
      }

      asyncRoutes.push(tmpRoute)
    }
  })

  return asyncRoutes
}

// setup
export const usePermissionStore = defineStore('permission', () => {
  // state
  const routes = ref<RouteRecordRaw[]>([])

  // actions
  function setRoutes(newRoutes: RouteRecordRaw[]) {
    routes.value = constantRoutes.concat(newRoutes)
    // console.log(routes.value)
  }
  /**
   * 生成动态路由
   *
   * @param roles 用户角色集合
   * @returns
   */
  function generateRoutes(roles: string[]) {
    return new Promise<RouteRecordRaw[]>((resolve, reject) => {
      // 接口获取所有路由
      const asyncRoutes = [
        {
          path: '/system',
          component: 'Layout',
          redirect: '/system/user',
          meta: {
            title: '系统管理',
            icon: 'system',
            hidden: false,
            roles: ['ADMIN'],
            keepAlive: true
          },
          children: [
            {
              path: 'user',
              component: 'system/user/index',
              name: 'User',
              meta: {
                title: '用户管理',
                icon: 'user',
                hidden: false,
                roles: ['ADMIN'],
                keepAlive: true
              }
            },
            {
              path: 'role',
              component: 'system/role/index',
              name: 'Role',
              meta: {
                title: '角色管理',
                icon: 'role',
                hidden: false,
                roles: ['ADMIN'],
                keepAlive: true
              }
            },
            {
              path: 'menu',
              component: 'system/menu/index',
              name: 'Menu',
              meta: {
                title: '菜单管理',
                icon: 'menu',
                hidden: false,
                roles: ['ADMIN'],
                keepAlive: true
              }
            },
            {
              path: 'dept',
              component: 'system/dept/index',
              name: 'Dept',
              meta: {
                title: '部门管理',
                icon: 'tree',
                hidden: false,
                roles: ['ADMIN'],
                keepAlive: true
              }
            },
            {
              path: 'dict',
              component: 'system/dict/index',
              name: 'Dict',
              meta: {
                title: '字典管理',
                icon: 'dict',
                hidden: false,
                roles: ['ADMIN'],
                keepAlive: true
              }
            }
          ]
        },
        {
          path: '/api',
          component: 'Layout',
          meta: {
            title: '接口',
            icon: 'api',
            hidden: false,
            roles: ['ADMIN'],
            keepAlive: true
          },
          children: [
            {
              path: 'api-doc',
              component: 'demo/api-doc',
              name: 'ApiDoc',
              meta: {
                title: '接口文档',
                icon: 'api',
                hidden: false,
                roles: ['ADMIN'],
                keepAlive: true
              }
            }
          ]
        },
        {
          path: '/doc',
          component: 'Layout',
          meta: {
            title: '平台文档',
            icon: 'document',
            hidden: false,
            roles: ['ADMIN'],
            keepAlive: true
          },
          children: [
            {
              path: 'internal-doc',
              component: 'demo/internal-doc',
              meta: {
                title: '平台文档(内嵌)',
                icon: 'document',
                hidden: false,
                roles: ['ADMIN'],
                keepAlive: true
              }
            },
            {
              path: 'https://juejin.cn/post/7228990409909108793',
              meta: {
                title: '平台文档(外链)',
                icon: 'link',
                hidden: false,
                roles: ['ADMIN'],
                keepAlive: true
              }
            }
          ]
        },
        {
          path: '/multi-level',
          component: 'Layout',
          redirect: '/multi-level/multi-level1',
          meta: {
            title: '多级菜单',
            icon: 'multi_level',
            hidden: false,
            roles: ['ADMIN'],
            keepAlive: true
          },
          children: [
            {
              path: 'multi-level1',
              component: 'demo/multi-level/level1',
              redirect: '/multi-level/multi-level2',
              name: 'MultiLevel1',
              meta: {
                title: '菜单一级',
                icon: '',
                hidden: false,
                roles: ['ADMIN'],
                keepAlive: true
              },
              children: [
                {
                  path: 'multi-level2',
                  component: 'demo/multi-level/children/level2',
                  redirect: '/multi-level/multi-level2/multi-level3-1',
                  name: 'MultiLevel2',
                  meta: {
                    title: '菜单二级',
                    icon: '',
                    hidden: false,
                    roles: ['ADMIN'],
                    keepAlive: true
                  },
                  children: [
                    {
                      path: 'multi-level3-1',
                      component: 'demo/multi-level/children/children/level3-1',
                      name: 'MultiLevel31',
                      meta: {
                        title: '菜单三级-1',
                        icon: '',
                        hidden: false,
                        roles: ['ADMIN'],
                        keepAlive: true
                      }
                    },
                    {
                      path: 'multi-level3-2',
                      component: 'demo/multi-level/children/children/level3-2',
                      name: 'MultiLevel32',
                      meta: {
                        title: '菜单三级-2',
                        icon: '',
                        hidden: false,
                        roles: ['ADMIN'],
                        keepAlive: true
                      }
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          path: '/table',
          component: 'Layout',
          meta: {
            title: 'Table',
            icon: 'table',
            hidden: true,
            roles: ['ADMIN'],
            keepAlive: true
          },
          children: [
            {
              path: 'dynamic-table',
              component: 'table/dynamic-table/index',
              name: 'DynamicTable',
              meta: {
                title: '动态Table',
                icon: '',
                hidden: true,
                roles: ['ADMIN'],
                keepAlive: true
              }
            },
            {
              path: 'drag-table',
              component: 'table/drag-table',
              name: 'DragTable',
              meta: {
                title: '拖拽Table',
                icon: '',
                hidden: true,
                roles: ['ADMIN'],
                keepAlive: true
              }
            },
            {
              path: 'complex-table',
              component: 'table/complex-table',
              name: 'ComplexTable',
              meta: {
                title: '综合Table',
                icon: '',
                hidden: true,
                roles: ['ADMIN'],
                keepAlive: true
              }
            }
          ]
        },
        {
          path: '/component',
          component: 'Layout',
          meta: {
            title: '组件封装',
            icon: 'menu',
            hidden: false,
            roles: ['ADMIN'],
            keepAlive: true
          },
          children: [
            {
              path: 'wang-editor',
              component: 'demo/wang-editor',
              name: 'WangEditor',
              meta: {
                title: '富文本编辑器',
                icon: '',
                hidden: false,
                roles: ['ADMIN'],
                keepAlive: true
              }
            },
            {
              path: 'upload',
              component: 'demo/upload',
              name: 'Upload',
              meta: {
                title: '图片上传',
                icon: '',
                hidden: false,
                roles: ['ADMIN'],
                keepAlive: true
              }
            },
            {
              path: 'icon-selector',
              component: 'demo/icon-selector',
              name: 'IconSelector',
              meta: {
                title: '图标选择器',
                icon: '',
                hidden: false,
                roles: ['ADMIN'],
                keepAlive: true
              }
            },
            {
              path: 'dict-demo',
              component: 'demo/dict',
              name: 'DictDemo',
              meta: {
                title: '字典组件',
                icon: '',
                hidden: false,
                roles: ['ADMIN'],
                keepAlive: true
              }
            },
            {
              path: 'signature',
              component: 'demo/signature',
              name: 'Signature',
              meta: {
                title: '签名',
                icon: '',
                hidden: false,
                roles: ['ADMIN'],
                keepAlive: true
              }
            },
            {
              path: 'table',
              component: 'demo/table',
              name: 'Table',
              meta: {
                title: '表格',
                icon: '',
                hidden: false,
                roles: ['ADMIN'],
                keepAlive: true
              }
            }
          ]
        },
        {
          path: '/function',
          component: 'Layout',
          meta: {
            title: '功能演示',
            icon: 'menu',
            hidden: false,
            roles: ['ADMIN'],
            keepAlive: true
          },
          children: [
            {
              path: 'permission',
              component: 'demo/permission/page',
              name: 'Permission',
              meta: {
                title: 'Permission',
                icon: '',
                hidden: false,
                roles: ['ADMIN'],
                keepAlive: true
              }
            },
            {
              path: 'icon-demo',
              component: 'demo/icons',
              name: 'IconDemo',
              meta: {
                title: 'Icons',
                icon: '',
                hidden: false,
                roles: ['ADMIN'],
                keepAlive: true
              }
            },
            {
              path: 'websocket',
              component: 'demo/websocket',
              name: 'Websocket',
              meta: {
                title: 'Websocket',
                icon: '',
                hidden: false,
                roles: ['ADMIN'],
                keepAlive: true
              }
            },
            {
              path: 'other',
              component: 'demo/other',
              meta: {
                title: '敬请期待...',
                icon: '',
                hidden: false,
                roles: ['ADMIN'],
                keepAlive: true
              }
            }
          ]
        }
      ]
      // console.log(111113333111111, roles)

      const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // console.log(accessedRoutes)
      setRoutes(accessedRoutes)
      resolve(accessedRoutes)
      // listRoutes()
      //   .then(({ data: asyncRoutes }) => {
      //     // 根据角色获取有访问权限的路由
      //     console.log(asyncRoutes)
      //     const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      //     console.log(accessedRoutes)
      //     setRoutes(accessedRoutes)
      //     resolve(accessedRoutes)
      //   })
      //   .catch((error) => {
      //     reject(error)
      //   })
    })
  }
  return {
    routes,
    setRoutes,
    generateRoutes
  }
})

// 非setup
export function usePermissionStoreHook() {
  return usePermissionStore(store)
}
