import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from '../components/HomeView.vue'
import TodoView from '../components/TodoView.vue'
import ArticleView from '../components/ArticleView.vue'
const routes = [
  { path: '/', component: HomeView },
  { path: '/todos', component: TodoView },
  { path: '/article', component: ArticleView },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router
