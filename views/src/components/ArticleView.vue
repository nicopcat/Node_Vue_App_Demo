<template>
  <div class="diary-container">
    <div class="header">
      <h1>我的日记</h1>
      <el-button type="primary" @click="handleNew">写日记</el-button>
    </div>
    
    <!-- 日记列表 -->
    <div class="diary-list" v-loading="loading">
      <el-empty v-if="articles.length === 0" description="暂无日记" />
      <el-row :gutter="20" v-else>
        <el-col :span="8" v-for="article in articles" :key="article._id">
          <el-card class="diary-card" shadow="hover" @click="viewDetail(article._id)">
            <template #header>
              <div class="card-header">
                <h3>{{ article.title }}</h3>
                <span class="date">{{ formatDate(article.createdAt) }}</span>
              </div>
            </template>
            <div class="card-content">
              <p class="summary">{{ getSummary(article.content) }}</p>
            </div>
            <div class="card-footer">
              <el-button link type="primary" @click.stop="edit(article._id)">编辑</el-button>
              <el-button link type="danger" @click.stop="del(article)">删除</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 编辑/新增对话框 -->
    <el-dialog 
      :title="isNew ? '写日记' : '编辑日记'" 
      v-model="dialogVisible" 
      width="60%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="newData" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="newData.title" placeholder="请输入日记标题" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input
            v-model="newData.content"
            type="textarea"
            :rows="10"
            placeholder="记录今天的心情..."
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submit" :loading="submitting">
            {{ isNew ? '保存' : '更新' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { getArticles, createArticle, updateArticle, deleteArticle } from '@/api/article'

const router = useRouter()
const articles = ref([])
const loading = ref(false)
const submitting = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const isNew = ref(false)

const newData = reactive({
  title: '',
  content: ''
})

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 获取内容摘要
const getSummary = (content) => {
  if (!content) return ''
  return content.length > 100 ? content.substring(0, 100) + '...' : content
}

// 获取日记列表
const fetchArticles = async () => {
  try {
    loading.value = true
    const res = await getArticles()
    articles.value = res || []
  } catch (err) {
    console.error(err)
    ElMessage.error('获取日记列表失败')
  } finally {
    loading.value = false
  }
}

// 创建新日记
const handleCreateArticle = async () => {
  if (!newData.title.trim()) {
    ElMessage.warning('请输入日记标题')
    return
  }
  
  try {
    submitting.value = true
    const articleData = {
      title: newData.title.trim(),
      content: newData.content.trim()
    }
    const res = await createArticle(articleData)
    ElMessage.success('日记创建成功')
    dialogVisible.value = false
    resetForm()
    await fetchArticles()
  } catch (err) {
    console.error(err)
    ElMessage.error('创建日记失败')
  } finally {
    submitting.value = false
  }
}

// 更新日记
const handleUpdateArticle = async (id) => {
  if (!newData.title.trim()) {
    ElMessage.warning('请输入日记标题')
    return
  }
  
  try {
    submitting.value = true
    const res = await updateArticle(id, newData)
    ElMessage.success('日记更新成功')
    dialogVisible.value = false
    resetForm()
    await fetchArticles()
  } catch (err) {
    console.error(err)
    ElMessage.error('更新日记失败')
  } finally {
    submitting.value = false
  }
}

// 删除日记
const del = async (article) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除日记《${article.title}》?`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    loading.value = true
    const res = await deleteArticle(article._id)
    ElMessage.success('日记删除成功')
    await fetchArticles()
  } catch (err) {
    if (err !== 'cancel') {
      console.error(err)
      ElMessage.error('删除日记失败')
    }
  } finally {
    loading.value = false
  }
}

// 提交表单
const submit = () => {
  if (isNew.value) {
    handleCreateArticle()
  } else {
    handleUpdateArticle(newData._id)
  }
}

// 编辑日记
const edit = (id) => {
  isEdit.value = true
  isNew.value = false
  const foundArticle = articles.value.find(a => a._id === id)
  Object.assign(newData, foundArticle)
  dialogVisible.value = true
}

// 新增日记
const handleNew = () => {
  isNew.value = true
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

// 查看日记详情
const viewDetail = (id) => {
  router.push(`/diary/${id}`)
}

// 重置表单
const resetForm = () => {
  Object.assign(newData, { 
    title: '', 
    content: '',
    _id: ''
  })
}

onMounted(() => {
  fetchArticles()
})
</script>

<style scoped>
.diary-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header h1 {
  margin: 0;
  font-size: 28px;
  color: #333;
}

.diary-list {
  margin-top: 20px;
}

.diary-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.diary-card:hover {
  transform: translateY(-5px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f0f4ff;
  padding: 10px;
  border-radius: 4px 4px 0 0;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.date {
  font-size: 14px;
  color: #666;
}

.card-content {
  min-height: 100px;
}

.summary {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  border-top: 1px solid #eee;
  padding-top: 10px;
}
</style>
