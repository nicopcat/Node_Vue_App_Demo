<template>
  <div class="my-articles">
    <div class="form-container">
      <el-form>
        <el-form-item label="题目">
          <el-input v-model="newData.title" />
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="newData.author" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input
            v-model="newData.content"
            type="textarea"
            :rows="4"
            resize="vertical"
          />
        </el-form-item>
        <el-button type="primary" @click="submit">{{ isNew ? '新增' : '编辑' }}</el-button>
      </el-form>
    </div>
    <el-table :data="articles" style="width: 100%" v-loading="loading">
      <el-table-column prop="title" label="标题" width="180" />
      <el-table-column prop="author" label="作者" width="120" />
      <el-table-column prop="content" label="内容" />
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="edit(scope.row._id)">编辑</el-button>
          <el-button link type="primary" size="small" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getArticles, createArticle, updateArticle, deleteArticle } from '@/api/article'

// 响应式状态
const articles = ref([])
const article = reactive({
  title: '',
  author: '',
  content: ''
})
const newData = reactive({
  title: '',
  author: '',
  content: ''
})
const loading = ref(false)
const isNew = ref(true)

// 方法定义
const fetchArticles = async () => {
  try {
    loading.value = true
    const res = await getArticles()
    articles.value = res.articles
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const handleCreateArticle = async () => {
  try {
    loading.value = true
    const res = await createArticle(newData)
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: res.msg
      })
      Object.assign(newData, { title: '', author: '', content: '' })
      await fetchArticles()
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const handleUpdateArticle = async (id) => {
  try {
    loading.value = true
    const res = await updateArticle(id, newData)
    if (res.article) {
      Object.assign(newData, { title: '', author: '', content: '' })
      isNew.value = true
      await fetchArticles()
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const del = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除文章《${row.title}》?`,
      'Warning',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    loading.value = true
    const res = await deleteArticle(row._id)
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: res.msg,
      })
      await fetchArticles()
    }
  } catch (err) {
    if (err !== 'cancel') {
      console.error(err)
    }
  } finally {
    loading.value = false
  }
}

const submit = () => {
  if (isNew.value) {
    handleCreateArticle()
  } else {
    handleUpdateArticle(article._id)
  }
}

const edit = (id) => {
  const foundArticle = articles.value.find(a => a._id === id)
  Object.assign(article, foundArticle)
  Object.assign(newData, foundArticle)
  isNew.value = false
}

// 组件挂载时获取文章列表
fetchArticles()
</script>

<style>
.my-articles {
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  
}
.form-container {
  margin: 40px 0 60px 0;
  width: 80%;
}

button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #1E6FAF;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #15446F;
}
</style>
