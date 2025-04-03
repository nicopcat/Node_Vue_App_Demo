import request from '@/utils/request'

// 用户登录
export function login(data: {
  username: string
  password: string
}) {
  return request({
    url: '/api/users/login',
    method: 'post',
    data
  })
}

// 用户注册
export function register(data: {
  username: string
  password: string
  confirmPassword: string
}) {
  return request({
    url: '/api/users/register',
    method: 'post',
    data
  })
} 