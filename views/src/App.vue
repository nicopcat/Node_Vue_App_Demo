<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const showNavbar = computed(() => userStore.isLoggedIn())

const isMenuActive = ref(false)

// 检测是否为移动端
const isMobile = computed(() => {
  return window.innerWidth <= 480; // 根据屏幕宽度判断
})

const toggleMenu = () => {
  isMenuActive.value = !isMenuActive.value
}

const handleLogout = () => {
  userStore.clearUserInfo()
  router.push('/login')
}
</script>

<template>
  <div class="main">
    <nav class="navbar">
      <div class="navbar-toggle" @click="toggleMenu" v-if="isMobile && showNavbar">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </div>
      <div class="navbar-brand">
        <h1>
          <router-link to="/" class="navbar-link">豚豚记事本</router-link>
        </h1>
      </div>
      <div class="navbar-links" v-if="!isMobile && showNavbar">
        <router-link to="/article" class="navbar-link">日记</router-link>
        <router-link to="/todos" class="navbar-link">待办</router-link>
      </div>
      <div class="navbar-user" v-if="showNavbar">
        {{ userStore.userInfo.username }}
        <el-button class="logout-button" @click="handleLogout">退出</el-button>
      </div>
    </nav>
    <div class="navbar-menu" :class="{ 'is-active': isMenuActive }" v-if="showNavbar">
      <ul>
        <li><router-link to="/article">日记</router-link></li>
        <li><router-link to="/todos">待办</router-link></li>
      </ul>
    </div>
    <RouterView />
  </div>
</template>

<style scoped>
.main {
  min-height: 100vh;
  overflow: hidden;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 2px 10px 20px;
  background-color: #4072bc; /* 导航栏背景颜色 */
  color: white;
}

.navbar-toggle {
  display: flex; /* 显示汉堡菜单 */
  flex-direction: column;
  cursor: pointer;
}

.bar {
  height: 3px;
  width: 25px;
  background-color: white;
  margin: 3px 0;
}

.navbar-brand h1 {
  margin: 0;
  font-size: 24px;
}

.navbar-links {
  display: flex; /* 水平排列菜单项 */
}

.navbar-link {
  color: white;
  text-decoration: none;
  margin-right: 20px; /* 菜单项之间的间距 */
}

.navbar-menu {
  display: none; /* 默认隐藏菜单 */
  position: absolute; /* 绝对定位 */
  top: 50px; /* 菜单位置，放在汉堡菜单下方 */
  left: 10px; /* 菜单位置 */
  background-color: #4072bc; /* 菜单背景颜色 */
  border-radius: 4px; /* 圆角 */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15); /* 阴影效果 */
  z-index: 1000; /* 确保在其他元素之上 */
  width: 150px; /* 调小菜单宽度 */
}

.navbar-menu.is-active {
  display: block; /* 菜单激活时显示 */
}

.navbar-menu ul {
  list-style: none;
  padding: 10px; /* 内边距 */
  margin: 0;
}

.navbar-menu li {
  margin: 5px 0; /* 增加菜单项之间的间距 */
}

.navbar-user {
  display: flex;
  align-items: center;
  color: antiquewhite;
}

.navbar-menu a {
  color: white;
  text-decoration: none;
  display: block; /* 使链接占满整个菜单项 */
  padding: 2px; /* 增加点击区域 */
}

.logout-button {
  background-color: transparent; /* 透明背景 */
  color: white; /* 字体颜色 */
  border: none; /* 去掉边框 */
  cursor: pointer; /* 鼠标指针 */
}

/* 移动端适配 */
@media (min-width: 769px) {
  .navbar-toggle {
    display: none; /* PC 端隐藏汉堡菜单 */
  }
}
</style>
