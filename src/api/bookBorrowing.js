import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/selectTicketByPage',
    method: 'post',
    data:params
  })
}
export function returnBook(params) {
  return request({
    url: '/returnBook',
    method: 'post',
    params
  })
}
export function returnBooks(params) {
  return request({
    url: '/returnBooks',
    method: 'post',
    data:params
  })
}
export function continueBook(params) {
    return request({
      url: '/continueBook',
      method: 'post',
      params
    })
}

