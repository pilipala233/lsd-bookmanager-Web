import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/selectTicketByPage',
    method: 'post',
    data:params
  })
}


