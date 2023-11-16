import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/lsd-bookmanager-Web/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/lsd-bookmanager-Web/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/lsd-bookmanager-Web/user/logout',
    method: 'post'
  })
}
