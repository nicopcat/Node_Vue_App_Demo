import request from '@/utils/request'

export function getArticles() {
  return request({
    url: '/api/articles',
    method: 'get'
  })
}

export function getArticle(id: string) {
  return request({
    url: `/api/articles/${id}`,
    method: 'get'
  })
}

export function createArticle(data: ArticleDTO) {
  return request({
    url: '/api/articles/add',
    method: 'post',
    data
  })
}

export function updateArticle(id: string, data: ArticleDTO) {
  return request({
    url: `/api/articles/${id}`,
    method: 'put',
    data
  })
}

export function deleteArticle(id: string) {
  return request({
    url: `/api/articles/${id}`,
    method: 'delete'
  })
}