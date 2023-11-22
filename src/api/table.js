import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/getBooksByPage',
    method: 'post',
    data:params
  })
}
export function getTypeMap() {
  return request({
    url: '/findAllBookCategory',
    method: 'get',
    
  })
}
export function addBorrowingTicket(params) {
  return request({
    url: '/addBorrowingTicket',
    method: 'post',
    data:params
  })
}