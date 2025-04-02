<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/api/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const isSubmitting = ref(false)
const registerForm = ref({
  username: '',
  password: '',
  confirmPassword: ''
})

const handleRegister = async () => {
  if (isSubmitting.value) return
  
  if (!registerForm.value.username || !registerForm.value.password || !registerForm.value.confirmPassword) {
    ElMessage.warning('请填写完整信息')
    return
  }

  if (registerForm.value.username.length < 6) {
    ElMessage.warning('用户名不能少于6位字符')
    return
  }

  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    ElMessage.warning('两次输入的密码不一致')
    return
  }

  isSubmitting.value = true
  try {
    await register(registerForm.value)
    ElMessage.success('注册成功')
    router.push('/login')
  } catch (error: any) {
    ElMessage.error(error.message || '注册失败')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="register-container">
    <div class="register-box">
      <h2>注册</h2>
      <el-form :model="registerForm" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="registerForm.username" placeholder="请输入用户名（不少于6位）" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input 
            v-model="registerForm.password" 
            type="password" 
            placeholder="请输入密码"
            @keyup.enter="handleRegister"
          />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input 
            v-model="registerForm.confirmPassword" 
            type="password" 
            placeholder="请再次输入密码"
            @keyup.enter="handleRegister"
          />
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleRegister"
            :loading="isSubmitting"
            :disabled="isSubmitting"
          >注册</el-button>
          <el-button @click="router.push('/login')">返回登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}

.register-box {
  width: 400px;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  h2 {
    text-align: center;
    margin-bottom: 30px;
    color: #333;
  }
}

:deep(.el-form-item:last-child) {
  margin-bottom: 0;
  text-align: center;
}
</style> 