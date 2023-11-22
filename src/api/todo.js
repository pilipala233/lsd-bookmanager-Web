import request from '@/utils/request'

export function returnBook() {
  return request({
    url: '/returnBook',
    method: 'get',
    
  })
}

export function continueBook() {
    return request({
      url: '/continueBook',
      method: 'get',
    
    })
}
export function updateTicketStatus(params) {
    return request({
      url: '/updateTicketStatus',
      method: 'get',
      data:params
    
    })
}
export function updateBorrowingTicketIsNotice() {
    return request({
      url: '/updateBorrowingTicketIsNotice',
      method: 'get',
    
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