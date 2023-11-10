import { loginApi, logoutApi } from '@/api/auth'
import { LoginData } from '@/api/auth/types'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { store } from '@/store'
import { getUserInfo } from '@/api/user'
import { UserInfo } from '@/api/user/types'
import router from '@/router'
export const useUserStore = defineStore('user', () => {
  const userId = ref()
  const username = ref('')
  const nickname = ref('')
  const avatar = ref('')
  const token = useStorage('accessToken', '')
  const roles = ref<Array<string>>([]) // 用户角色编码集合 → 判断路由权限
  const perms = ref<Array<string>>([]) // 用户权限编码集合 → 判断按钮权限
  function login(loginData: LoginData) {
    return new Promise<void>((resolve, reject) => {
      loginApi(loginData)
        .then((response) => {
          const { Token } = response.data
          token.value = Token
          // const { tokenType, accessToken } = response.data
          // console.log(tokenType, accessToken)
          // token.value = tokenType + ' ' + accessToken
          console.log(token.value)
          resolve()
        })
        .catch((error) => {
          console.log(error)
          reject(error)
        })
    })
  }
  // 获取信息(用户昵称、头像、角色集合、权限集合)
  function getInfo() {
    return new Promise<UserInfo>((resolve, reject) => {
      getUserInfo()
        .then(({ data }) => {
          data.roles = JSON.parse(data.roles)
          console.log(data.roles, 123123123)
          if (!data) {
            return reject('Verification failed, please Login again.')
          }
          if (!data.roles || data.roles.length <= 0) {
            reject('getUserInfo: roles must be a non-null array!')
          }
          userId.value = data.userId
          nickname.value = data.nickname
          username.value = data.nickname
          avatar.value = data.avatar
          roles.value = data.roles
          perms.value = data.perms
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  // 注销
  function logout() {
    return new Promise<void>((resolve, reject) => {
      logoutApi()
        .then(() => {
          router.replace({ path: '/login' })
          resetToken()
          location.reload() // 清空路由
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  // 重置
  function resetToken() {
    token.value = ''
    username.value = ''
    avatar.value = ''
    roles.value = []
    perms.value = []
  }
  return {
    token,
    username,
    avatar,
    roles,
    perms,
    login,
    getInfo,
    logout,
    resetToken
  }
})
// 非setup
export function useUserStoreHook() {
  return useUserStore(store)
}
