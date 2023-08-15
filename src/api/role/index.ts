import request from '@/utils/request'
import { AxiosPromise } from 'axios'

// 获取角色下拉列表
export function listRoleOptions() {
  return request({
    url:"/api/v1/roles/options",
    method:'get'
  })
}
