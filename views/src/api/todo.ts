import request from './config'

export function getTodos() {
  return request({
    url: '/todos',
    method: 'get'
  })
}

export function createTodo(data: TodoDTO) {
  return request({
    url: '/todos/add',
    method: 'post',
    data
  })
}

export function updateTodo(id: string, data: TodoDTO) {
  return request({
    url: `/todos/${id}`,
    method: 'put',
    data
  })
}

export function deleteTodo(id: string) {
  return request({
    url: `/todos/${id}`,
    method: 'delete'
  })
}