import axios from 'axios'

const service = axios.create({
  baseURL: 'https://node-demo-server-nine.vercel.app',
  timeout: 5000
})

// 响应拦截器
service.interceptors.response.use(
  response => response.data,
  error => {
    return Promise.reject(error)
  }
)

export default service 