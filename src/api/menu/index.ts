import request from '@/utils/request'

export function listRoutes() {
  return request({
    url: '/api/v1/menus/routes',
    method: 'get'
  })
}
