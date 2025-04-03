<template>
  <div class="diary-detail">
    <div class="header">
      <el-button @click="goBack">返回</el-button>
      <div class="actions">
        <el-button type="primary" @click="handleEdit">编辑</el-button>
        <el-button type="danger" @click="handleDelete">删除</el-button>
      </div>
    </div>

    <div class="content" v-loading="loading">
      <template v-if="diary">
        <h1>{{ diary.title }}</h1>
        <div class="meta">
          <span class="date">{{ formatDate(diary.createdAt) }}</span>
        </div>
        <div class="diary-content">
          {{ diary.content }}
        </div>
      </template>
      <el-empty v-else description="日记不存在" />
    </div>

    <!-- 编辑对话框 -->
    <el-dialog 
      title="编辑日记" 
      v-model="dialogVisible" 
      width="60%"
    >
      <el-form :model="editData" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="editData.title" placeholder="请输入日记标题" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input
            v-model="editData.content"
            type="textarea"
            :rows="10"
            placeholder="记录今天的心情..."
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave" :loading="submitting">
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getArticle, updateArticle, deleteArticle } from '@/api/article'

const route = useRoute()
const router = useRouter()
const diary = ref(null)
const loading = ref(false)
const submitting = ref(false)
const dialogVisible = ref(false)

const editData = reactive({
  title: '',
  content: ''
})

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 获取日记详情
const fetchDiary = async () => {
  const id = route.params.id
  if (!id) return

  try {
    loading.value = true
    const res = await getArticle(id)
    diary.value = res
  } catch (err) {
    console.error(err)
    ElMessage.error('获取日记详情失败')
  } finally {
    loading.value = false
  }
}

// 返回列表页
const goBack = () => {
  router.back()
}

// 编辑日记
const handleEdit = () => {
  Object.assign(editData, {
    title: diary.value.title,
    content: diary.value.content
  })
  dialogVisible.value = true
}

// 保存编辑
const handleSave = async () => {
  if (!editData.title.trim()) {
    ElMessage.warning('请输入日记标题')
    return
  }

  try {
    submitting.value = true
    await updateArticle(diary.value._id, editData)
    ElMessage.success('日记更新成功')
    dialogVisible.value = false
    await fetchDiary()
  } catch (err) {
    console.error(err)
    ElMessage.error('更新日记失败')
  } finally {
    submitting.value = false
  }
}

// 删除日记
const handleDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除日记《${diary.value.title}》?`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    loading.value = true
    await deleteArticle(diary.value._id)
    ElMessage.success('日记删除成功')
    router.push('/diary')
  } catch (err) {
    if (err !== 'cancel') {
      console.error(err)
      ElMessage.error('删除日记失败')
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDiary()
})
</script>

<style scoped>
.diary-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.content {
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.content h1 {
  margin: 0 0 20px;
  font-size: 28px;
  color: #333;
}

.meta {
  margin-bottom: 30px;
  color: #999;
}

.date {
  font-size: 14px;
}

.diary-content {
  line-height: 1.8;
  color: #666;
  white-space: pre-wrap;
}
</style> 