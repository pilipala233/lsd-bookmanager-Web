import request from '@/utils/request'

export function returnBook(params) {
  return request({
    url: '/returnBook',
    method: 'post',
    params
  })
}

export function continueBook(params) {
    return request({
      url: '/continueBook',
      method: 'post',
      params
    })
}
export function updateTicketStatus(params) {
    return request({
      url: '/updateTicketStatus',
      method: 'post',
      data:params
    
    })
}
export function updateBorrowingTicketIsNotice(params) {
    return request({
      url: '/updateBorrowingTicketIsNotice',
      method: 'get',
      params
    })
}
export function selectBorrowingTicketByReturnDate(params) {
    return request({
      url: '/selectBorrowingTicketByReturnDate',
      method: 'post',
      data:params
    
    })
}
export function selectBorrowingTicketByIsNotice(params) {
    return request({
      url: '/selectBorrowingTicketByIsNotice',
      method: 'post',
      data:params
    
    })
}
export function selectApprovalTicketByPage(params) {
    return request({
      url: '/selectApprovalTicketByPage',
      method: 'post',
      data:params
    
    })
}