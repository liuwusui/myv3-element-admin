import request from '@/utils/request'
import { AxiosPromise } from 'axios'

// 新增角色
export function addRoles(data) {
  return request({
    url: '/api/v1/roles',
    method: 'post',
    data: data
  })
}
// 删除角色
export function delRoles(ids) {
  return request({
    url: `/api/v1/roles/{ids}`,
    method: 'delete'
  })
}
// 获取角色下拉列表
export function listRoleOptions() {
  return request({
    url: '/api/v1/roles/options',
    method: 'get'
  })
}

export function getRoleData() {
  return request({
    url: '/api/v1/roles/page',
    method: 'get'
  })
}

export function getRoleList(roleId: number) {
  return request({
    url: `/api/v1/roles/${roleId}/form`,
    method: 'get'
  })
}
