import request from '@/utils/request'

export function deptOptions() {
  return request({
    url: '/api/v1/dept/options',
    method: 'get'
  })
}
