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