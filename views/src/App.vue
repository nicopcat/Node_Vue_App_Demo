<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const showNavbar = computed(() => userStore.isLoggedIn())

const handleLogout = () => {
  userStore.clearUserInfo()
  router.push('/login')
}
</script>

<template>
  <div class="main">
    <nav v-if="showNavbar" class="navbar">
      <div class="nav-left">
        <RouterLink to="/" class="nav-item">首页</RouterLink>
        <RouterLink to="/article" class="nav-item">日记</RouterLink>
        <RouterLink to="/todos" class="nav-item">待办</RouterLink>
      </div>
      <div class="nav-right">
        <span class="username">{{ userStore.userInfo.username }}</span>
        <el-button link @click="handleLogout" class="logout-btn">退出</el-button>
      </div>
    </nav>
    <RouterView />
  </div>
</template>

<style scoped>
.main {
  min-height: 100vh;
}

.navbar {
  background-color: #fff;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-left, .nav-right {
  display: flex;
  align-items: baseline;
  gap: 1rem;
}

.nav-item {
  text-decoration: none;
  color: #333;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-item:hover {
  background-color: #f5f7fa;
}

.nav-item.router-link-active {
  color: #409eff;
  background-color: #ecf5ff;
}

.username {
  color: #606266;
  margin-right: 0.5rem;
}

.logout-btn {
  color: #f56c6c;
  padding: 0.5rem 1rem;
  height: auto;
  line-height: 1.5;
  font-size: 14px;
}

.logout-btn:hover {
  color: #f78989;
  background-color: #fef0f0;
  border-radius: 4px;
}
</style>
