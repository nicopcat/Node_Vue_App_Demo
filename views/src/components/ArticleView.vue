<template>
  <div class="diary-container">
    <div class="header">
      <h1>我的日记</h1>
      <el-button type="primary" @click="handleNew">写日记</el-button>
    </div>
    
    <div class="diary-list" v-loading="loading">
      <el-empty v-if="articles.length === 0" description="暂无日记" />
      <ul v-else>
        <li v-for="article in articles" :key="article._id" class="diary-item" @click="viewDetail(article._id)">
          <div class="item-header">
            <h1>{{ article.title }}</h1>
            <span class="date">{{ formatDate(article.createdAt) }}</span>
          </div>
          <p class="summary markdown-body" v-html="getMarkdownSummary(article.content)"></p>
          <div class="item-footer">
            <el-button link type="primary" @click.stop="edit(article._id)">编辑</el-button>
            <el-button link type="danger" @click.stop="del(article)">删除</el-button>
          </div>
        </li>
      </ul>
    </div>

    <!-- 编辑/新增对话框 -->
    <el-dialog 
      :title="isNew ? '写日记' : '编辑日记'" 
      v-model="dialogVisible" 
      width="90%"
      style="max-width: 600px;"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="newData" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="newData.title" placeholder="请输入日记标题" />
        </el-form-item>
        <el-form-item label="内容">
          <div class="markdown-tips">
            支持Markdown语法：**粗体**、*斜体*、# 标题、- 列表、```代码块、> 引用等
          </div>
          <el-input
            v-model="newData.content"
            type="textarea"
            :rows="10"
            placeholder="记录今天的心情..."
            show-word-limit
            maxlength="3000"
          />
          <div class="preview-toggle">
            <el-switch
              v-model="showPreview"
              active-text="预览"
              inactive-text="编辑"
            />
          </div>
          <div v-if="showPreview" class="markdown-preview markdown-body">
            <div v-html="renderedPreview"></div>
          </div>
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
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { getArticles, createArticle, updateArticle, deleteArticle } from '@/api/article'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import { gfmHeadingId } from 'marked-gfm-heading-id'

// 配置marked
// 使用插件解决headerIds警告
marked.use(gfmHeadingId);

// 设置marked选项
const markedOptions = {
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  },
  breaks: true,  // 自动将换行符转换为<br>标签
  gfm: true      // 启用GitHub风格的Markdown
};

// 将内容渲染为Markdown，增加错误处理
const safeMarked = (content) => {
  if (!content) return '';
  try {
    return marked.parse(content, markedOptions);
  } catch (error) {
    console.error('Markdown rendering error:', error);
    return `<p>${content}</p>`;
  }
}

const router = useRouter()
const articles = ref([])
const loading = ref(false)
const submitting = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const isNew = ref(false)
const showPreview = ref(false)

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
  return content.length > 100 ? content.substring(0, 60) + '...' : content
}

// 获取Markdown格式的摘要
const getMarkdownSummary = (content) => {
  if (!content) return ''
  const summary = content.length > 150 ? content.substring(0, 100) + '...' : content
  return safeMarked(summary)
}

// 预览时将编辑内容渲染为Markdown
const renderedPreview = computed(() => {
  if (!newData.content) return '';
  return safeMarked(newData.content);
})

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
  showPreview.value = false
  dialogVisible.value = true
}

// 新增日记
const handleNew = () => {
  isNew.value = true
  isEdit.value = false
  resetForm()
  showPreview.value = false
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
  font-size: 24px;
}

.diary-list {
  margin-top: 20px;
}

.diary-item {
  background: #ffffff;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: background 0.3s;
}

.diary-item:hover {
  background: #f5f5f5;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #666;
  h1{
    font-size: 1.8em;
  }
}

.item-header h3 {
  margin: 0;
  font-size: 16px;
}

.date {
  font-size: 12px;
  color: #999;
}

.summary {
  margin: 10px 0;
  color: #666;
  line-height: 1.5;
  overflow: auto;
}

.item-footer {
  display: flex;
  justify-content: flex-end;
}

.markdown-body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4),
.markdown-body :deep(h5),
.markdown-body :deep(h6) {
  margin-top: 16px;
  margin-bottom: 8px;
  font-weight: 600;
  line-height: 1.25;
  font-size: inherit;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 2em;
  margin-top: 0;
  margin-bottom: 8px;
}

.markdown-body :deep(pre) {
  padding: 8px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f7f7f7;
  border-radius: 3px;
  margin-top: 0;
  margin-bottom: 8px;
}

.markdown-body :deep(code) {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(175, 184, 193, 0.2);
  border-radius: 3px;
}

.markdown-body :deep(pre code) {
  padding: 0;
  background-color: transparent;
}

.markdown-body :deep(blockquote) {
  padding: 0 1em;
  color: #57606a;
  border-left: 0.25em solid #d0d7de;
  margin: 8px 0;
}

.markdown-tips {
  color: #909399;
  font-size: 12px;
  margin-bottom: 8px;
}

.preview-toggle {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

.markdown-preview {
  margin-top: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 16px;
  background-color: #fafafa;
  max-height: 400px;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .diary-container {
    padding: 10px;
  }

  .header h1 {
    font-size: 20px;
  }

  .diary-item {
    padding: 10px;
  }

  .item-header h1 {
    font-size: 18px;
    margin: 0;
  }

  .date {
    font-size: 10px;
  }

  .summary {
    font-size: 14px;
  }

  .markdown-body {
    padding-bottom: 10px;
  }

  .markdown-body :deep(h1) {
    font-size: 20px;
  }

  .markdown-body :deep(h2) {
    font-size: 18px;
  }

  .markdown-body :deep(p),
  .markdown-body :deep(li),
  .markdown-body :deep(blockquote) {
    font-size: 14px;
  }

  .markdown-body :deep(code),
  .markdown-body :deep(pre) {
    font-size: 12px;
  }
}

ul{
  padding: 0;
}
</style>
