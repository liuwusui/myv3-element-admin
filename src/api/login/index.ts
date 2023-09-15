import request from '@/utils/request'
import { AxiosPromise } from 'axios'

// 注册用户
export function register(data) {
  return request({
    url: '/user/register',
    method: 'get',
    params: data
  })
}

// // 用户登录
// export function register(data) {
//   return request({
//     url: '/user/register',
//     method: 'get',
//     params: data
//   })
// }
