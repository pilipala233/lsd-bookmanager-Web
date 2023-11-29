import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}
export function register(data) {
  return request({
    url: '/register',
    method: 'post',
    data
  })
}
export function getInfo(token) {
  return request({
    url: '/getUserInfo',
    method: 'get'
    
  })
}

export function logout() {
  return request({
    url: '/api/logout',
    method: 'get'
  })
}
export function selectMenuByUserId() {
  return request({
    url: '/selectMenuByUserId',
    method: 'get'
  })
}
export function updateUser(params) {
  return request({
    url: '/updateUser',
    method: 'post',
    data:params
  })
}