import request from './config'

export function getArticles() {
  return request({
    url: '/articles',
    method: 'get'
  })
}

export function createArticle(data) {
  return request({
    url: '/articles',
    method: 'post',
    data
  })
}

export function updateArticle(id, data) {
  return request({
    url: `/articles/${id}`,
    method: 'put',
    data
  })
}

export function deleteArticle(id) {
  return request({
    url: `/articles/${id}`,
    method: 'delete'
  })
} 