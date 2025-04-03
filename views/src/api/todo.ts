import request from '@/utils/request'

// 定义接口类型
export interface Todo {
  _id: string
  task: string
  importance?: number
  completed: boolean
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CreateTodoData {
  task: string
  importance?: number
  completed?: boolean
}

export interface UpdateTodoData {
  task?: string
  importance?: number
  completed?: boolean
}

// 获取所有 todos
export const getTodos = () => {
  return request.get<Todo[]>('/api/todos')
}

// 创建新的 todo
export const createTodo = (data: CreateTodoData) => {
  return request.post<Todo>('/api/todos/add', data)
}

// 更新 todo
export const updateTodo = (id: string, data: UpdateTodoData) => {
  return request.put<Todo>(`/api/todos/${id}`, data)
}

// 删除 todo
export const deleteTodo = (id: string) => {
  return request.delete(`/api/todos/${id}`)
}