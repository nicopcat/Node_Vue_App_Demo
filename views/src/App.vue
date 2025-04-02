<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'

const userStore = useUserStore()
const showNavbar = computed(() => userStore.isLoggedIn())
</script>

<template>
  <div class="main">
    <nav v-if="showNavbar" class="navbar">
      <RouterLink to="/" class="nav-item">首页</RouterLink>
      <RouterLink to="/article" class="nav-item">日记</RouterLink>
      <RouterLink to="/todos" class="nav-item">待办</RouterLink>
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
</style>
