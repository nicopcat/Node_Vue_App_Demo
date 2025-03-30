import request from './config'

export function getArticles() {
  return request({
    url: '/articles',
    method: 'get'
  })
}

export function createArticle(data: ArticleDTO) {
  return request({
    url: '/articles/add',
    method: 'post',
    data
  })
}

export function updateArticle(id: string, data: ArticleDTO) {
  return request({
    url: `/articles/${id}`,
    method: 'put',
    data
  })
}

export function deleteArticle(id: string) {
  return request({
    url: `/articles/${id}`,
    method: 'delete'
  })
}