import request from './config'

export interface LoginParams {
  username: string
  password: string
}

export interface RegisterParams extends LoginParams {
  confirmPassword: string
}

export const login = (data: LoginParams) => {
  return request({
    url: '/api/user/login',
    method: 'post',
    data
  })
}

export const register = (data: RegisterParams) => {
  return request({
    url: '/api/user/register',
    method: 'post',
    data
  })
} 