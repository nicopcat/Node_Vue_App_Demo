<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { login } from '@/api/user'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const isSubmitting = ref(false)
const loginForm = ref({
  username: '',
  password: ''
})

// 检测是否为移动端
const isMobile = computed(() => {
  return window.innerWidth <= 480; // 根据屏幕宽度判断
})

const handleLogin = async () => {
  if (isSubmitting.value) return

  if (!loginForm.value.username || !loginForm.value.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }

  isSubmitting.value = true
  try {
    const {token, user} = await login(loginForm.value)
    userStore.setToken(token)
    userStore.setUserInfo(user)
    ElMessage.success('登录成功')

    // 登录成功后跳转到重定向参数指定的路径，如果没有则跳转到首页
    const redirectPath = route.query.redirect as string || '/'
    router.push(redirectPath)
  } catch (error: any) {
    ElMessage.error(error.message || '登录失败')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-box" :class="{ 'mobile': isMobile }">
      <h2>登录</h2>
      <el-form :model="loginForm" :label-width="isMobile ? '60px' : '80px'">
        <el-form-item label="用户名">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item style="margin-top: 2rem;">
          <el-button
            type="primary"
            @click="handleLogin"
            :loading="isSubmitting"
            :disabled="isSubmitting"
            class="login-button"
          >登录</el-button>
          <el-button @click="router.push('/register')" class="register-button">注册账号</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #a8c8e0, #4072bc1d);
  padding: 0 15px;
}

.login-box {
  width: 400px;
  padding: 40px;
  background: linear-gradient(white, #f9f9f9);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  min-height: 300px;

  h2 {
    text-align: center;
    margin-bottom: 30px;
    color: #333;
  }
}

/* 移动端适配样式 */
.login-box.mobile {
  width: 100%;
  max-width: 320px;
  padding: 10px 20px;
  min-height: auto;
}

:deep(.el-form-item:last-child) {
  margin-bottom: 0;
  text-align: center;
}

/* 移动端按钮样式 */
@media (max-width: 480px) {
  .login-box {
    width: 100%;
    max-width: 320px;
    padding: 10px;
    min-height: auto;
  }
  .login-button, .register-button {
    width: 100%;
    margin: 5px 0;
  }

  :deep(.el-form-item__content) {
    display: flex;
    flex-direction: column;
  }

  h2 {
    font-size: 20px;
  }
}
</style>