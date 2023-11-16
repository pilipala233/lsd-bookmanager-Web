import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/lsd-bookmanager-Web/table/list',
    method: 'get',
    params
  })
}
