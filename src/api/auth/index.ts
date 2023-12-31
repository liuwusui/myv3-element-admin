// src/api/auth/index.ts
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { LoginData, LoginResult } from './types'

/**
 * 登录API
 *
 * @param data {LoginData}
 * @returns
 */
export function loginApi(data: LoginData): AxiosPromise<LoginResult> {
  return request({
    url: '/api/v1/auth/login',
    method: 'post',
    params: data
  })
}

// // 自己写的登录
// export function loginApi(data: LoginData): AxiosPromise<LoginResult> {
//   return request({
//     url: '/api/v1/auth/login',
//     method: 'post',
//     params: data
//   })
// }
export function logoutApi() {
  return request({
    url: '/api/v1/auth/logout',
    method: 'delete'
  })
}

export function getCaptchaApi() {
  return request({
    url: 'api/v1/auth/captcha',
    method: 'get'
  })
}
