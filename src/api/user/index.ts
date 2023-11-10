import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { UserForm, UserInfo, UserPageVO, UserQuery } from './types'

// 获取部门列表
export function getdept() {
  return request({
    url: '/api/v1/dept',
    method: 'get'
  })
}
// 用户表格数据
export function getUsers(data?: UserQuery) {
  return request({
    url: '/api/v1/users/page',
    method: 'get',
    params: data
  })
}
// 用户表格数据
export function getUserList({ pagenum, pagesize }) {
  return request({
    url: '/api/getUserList',
    method: 'get',
    params: {
      pagenum: pagenum,
      pagesize: pagesize
    }
  })
}

// 新增用户

export function addUser(data: any) {
  return request({
    url: '/api/v1/users',
    method: 'post',
    data: data
  })
}

// 根据id获取用户数据
export function userById(userId: number) {
  return request({
    url: `/api/v1/users/${userId}/form`,
    method: 'get'
  })
}

// 删除用户
export function deleteUser(ids: any) {
  return request({
    url: `/api/v1/del/users?ids=${ids}`,
    method: 'delete'
  })
}
// 下载模板
export function downTemp() {
  return request({
    url: '/api/v1/users/template',
    method: 'get'
  })
}

// 导入
export function importUser(deptId: number, file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return request({
    url: '/api/v1/users/_import',
    method: 'post',
    params: {
      deptId: deptId
    },
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 登录成功后获取用户信息（昵称、头像、权限集合和角色集合）
 */
// export function getUserInfo() {
//   return request({
//     url: '/api/v1/users/me',
//     method: 'get'
//   })
// }
export function getUserInfo() {
  return request({
    url: '/api/v1/users/me',
    method: 'get'
  })
}

/**
 * 获取用户分页列表
 *
 * @param queryParams
 */
export function getUserPage(
  queryParams: UserQuery
): AxiosPromise<PageResult<UserPageVO[]>> {
  return request({
    url: '/api/v1/users/page',
    method: 'get',
    params: queryParams
  })
}

/**
 * 获取用户表单详情
 *
 * @param userId
 */
export function getUserForm(userId: number): AxiosPromise<UserForm> {
  return request({
    url: '/api/v1/users/' + userId + '/form',
    method: 'get'
  })
}

/**
 * 修改用户
 *
 * @param id
 * @param data
 */
export function updateUser(id: number, data: UserForm) {
  return request({
    url: '/api/v1/users/' + id,
    method: 'put',
    data: data
  })
}

// // 编辑用户
// export function editUser(userId: number, data: UserForm) {
//   return request({
//     url: `api/v1/users/${userId}`,
//     method: 'put',
//     data: data
//   })
// }

/**
 * 修改用户状态
 *
 * @param id
 * @param status
 */
export function updateUserStatus(id: number, status: number) {
  return request({
    url: '/api/v1/users/' + id + '/status',
    method: 'patch',
    params: { status: status }
  })
}

/**
 * 修改用户密码
 *
 * @param id
 * @param password
 */
export function updateUserPassword(id: number, password: string) {
  return request({
    url: '/api/v1/users/' + id + '/password',
    method: 'patch',
    params: { password: password }
  })
}

/**
 * 删除用户
 *
 * @param ids
 */
export function deleteUsers(ids: string) {
  return request({
    url: '/api/v1/users/' + ids,
    method: 'delete'
  })
}

/**
 * 下载用户导入模板
 *
 * @returns
 */
export function downloadTemplateApi() {
  return request({
    url: '/api/v1/users/template',
    method: 'get',
    responseType: 'arraybuffer'
  })
}

/**
 * 导出用户
 *
 * @param queryParams
 * @returns
 */
export function exportUser(queryParams: UserQuery) {
  return request({
    url: '/api/v1/users/_export',
    method: 'get',
    params: queryParams,
    responseType: 'arraybuffer'
  })
}

/**
 * 导入用户
 *
 * @param file
 */
// export function importUser(deptId: number, file: File) {
//   const formData = new FormData()
//   formData.append('file', file)
//   return request({
//     url: '/api/v1/users/_import',
//     method: 'post',
//     params: { deptId: deptId },
//     data: formData,
//     headers: {
//       'Content-Type': 'multipart/form-data'
//     }
//   })
// }
