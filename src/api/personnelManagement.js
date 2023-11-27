import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/selectUserByPage',
    method: 'post',
    data:params
  })
}

export function getTypeMap() {
    return request({
      url: '/findAllRole',
      method: 'get',
      
    })
}
export function deleteUser(params) {
    return request({
      url: '/deleteUser',
      method: 'get',
      params
    })
}
export function deleteUsers(params) {
    return request({
      url: '/deleteUsers',
      method: 'post',
      data:params
    })
}
  export function addUser(params) {
    return request({
      url: '/addUser',
      method: 'post',
      data:params
    })
  }
