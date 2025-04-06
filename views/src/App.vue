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

const handleClickRouter = () => {
  console.log('?');
  isMenuActive.value = !isMenuActive.value
}
</script>

<template>
  <div class="main">
    <nav class="navbar">
      <div class="navbar-toggle" @click="toggleMenu"
        v-if="isMobile && showNavbar">
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
        <router-link to="/article" class="navbar-link"
          active-class="navbar-link-active">日记</router-link>
        <router-link to="/todos" class="navbar-link"
          active-class="navbar-link-active">待办</router-link>
      </div>
      <div class="navbar-user" v-if="showNavbar">
        {{ userStore.userInfo.username }}
        <el-button class="logout-button" @click="handleLogout">退出</el-button>
      </div>
    </nav>
    <div class="navbar-menu" :class="{ 'is-active': isMenuActive }"
      v-if="showNavbar">
      <ul @click="handleClickRouter">
        <li><router-link to="/article"
            active-class="navbar-link-active">日记</router-link></li>
        <li><router-link to="/todos"
            active-class="navbar-link-active">待办</router-link></li>
      </ul>
    </div>
    <RouterView />
  </div>
</template>

<style scoped lang="less">
  @navcolor: #4072bc;
  @white: white;
  @activecolor: #3259a1;

  .main {
    min-height: 100vh;
    overflow: hidden;
  }

  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 2px 10px 20px;
    background-color: @navcolor;
    color: @white;

    &-toggle {
      display: flex;
      flex-direction: column;
      cursor: pointer;

      @media (min-width: 769px) {
        display: none;
      }

      .bar {
        height: 3px;
        width: 25px;
        background-color: @white;
        margin: 3px 0;
      }
    }

    &-brand {
      h1 {
        margin: 0;
        font-size: 24px;
      }
    }

    &-links {
      display: flex;
    }

    &-link {
      color: @white;
      text-decoration: none;
      margin-right: 20px;
      padding: 5px 10px;
      border-radius: 4px;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }

      &-active {
        background-color: @activecolor;
        font-weight: 500;
      }
    }

    &-user {
      display: flex;
      align-items: center;
      color: antiquewhite;

      .logout-button {
        background-color: transparent;
        color: @white;
        border: none;
        cursor: pointer;
      }
    }

    &-menu {
      display: none;
      position: absolute;
      top: 50px;
      left: 10px;
      background-color: @navcolor;
      border-radius: 4px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      z-index: 9999;
      width: 150px;

      &.is-active {
        display: block;
      }

      ul {
        list-style: none;
        padding: 10px;
        margin: 0;

        li {
          margin: 5px 0;
        }
      }

      a {
        color: @white;
        text-decoration: none;
        display: block;
        padding: 6px 10px;
        border-radius: 4px;
        transition: background-color 0.3s ease;

        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        &.navbar-link-active {
          background-color: @activecolor;
          font-weight: 500;
        }
      }
    }
  }
</style>
