import request from './config'

export function getTodos() {
  return request({
    url: '/todos',
    method: 'get'
  })
}

export function createTodo(data) {
  return request({
    url: '/todos/add',
    method: 'post',
    data
  })
}

export function updateTodo(id, data) {
  return request({
    url: `/todos/${id}`,
    method: 'put',
    data
  })
}

export function deleteTodo(id) {
  return request({
    url: `/todos/${id}`,
    method: 'delete'
  })
}