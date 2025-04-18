// @ts-ignore
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../components/HomeView.vue'
import TodoView from '@/components/TodoView.vue'
import ArticleView from '../components/ArticleView.vue'
import DiaryDetail from '@/components/DiaryDetail.vue'
import DiaryEditor from '@/components/DiaryEditor.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }  // 确保设置了 requiresAuth
    },
    {
      path: '/article',
      name: 'article',
      component: ArticleView,
      meta: { requiresAuth: true }
    },
    {
      path: '/diary/new',
      name: 'diary-new',
      component: DiaryEditor,
      meta: { requiresAuth: true }
    },
    {
      path: '/diary/edit/:id',
      name: 'diary-edit',
      component: DiaryEditor,
      meta: { requiresAuth: true }
    },
    {
      path: '/diary/:id',
      name: 'diary-detail',
      component: DiaryDetail,
      meta: { requiresAuth: true }
    },
    {
      path: '/todos',
      name: 'todos',
      component: TodoView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    }
  ]
})

// 修改路由守卫逻辑
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // 如果需要认证且未登录
  if (to.meta.requiresAuth && !userStore.isLoggedIn()) {
    // 重定向到登录页，并保存原始路径作为重定向参数
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else {
    // 如果已登录且要访问登录/注册页
    if (userStore.isLoggedIn() && (to.path === '/login' || to.path === '/register')) {
      // 如果有重定向参数，则重定向到该参数指定的路径
      const redirectPath = to.query.redirect as string || '/'
      next(redirectPath)
    } else {
      next()
    }
  }
})

export default router
