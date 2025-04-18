<template>
  <div class="diary-detail">
    <div class="header">
      <el-button @click="goBack">返回</el-button>
      <div class="actions">
        <el-button type="primary" @click="goToEdit">编辑</el-button>
        <el-button type="danger" @click="handleDelete">删除</el-button>
      </div>
    </div>

    <div class="content" v-loading="loading">
      <template v-if="diary">
        <h1>{{ diary.title }}</h1>
        <div class="meta">
          <span class="date">{{ formatDate(diary.createdAt) }}</span>
        </div>
        <div class="diary-content markdown-body" v-html="renderedContent"></div>
      </template>
      <el-empty v-else description="日记不存在" />
    </div>


  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getArticle, updateArticle, deleteArticle } from '@/api/article'
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

const route = useRoute()
const router = useRouter()
const diary = ref(null)
const loading = ref(false)

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 将内容渲染为Markdown
const renderedContent = computed(() => {
  if (!diary.value || !diary.value.content) return '';
  return safeMarked(diary.value.content);
})



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

// 跳转到编辑页面
const goToEdit = () => {
  router.push(`/diary/edit/${diary.value._id}`)
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
    router.push('/article')
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
  background-color: #fafafa;
  color: #333;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.content {
  padding: 0;
  text-align: left;
}

.content h1 {
  margin: 0 0 20px;
  font-size: 32px;
  color: #333;
  font-weight: 600;
  letter-spacing: -0.5px;
  line-height: 1.2;
}

.meta {
  margin-bottom: 40px;
  color: #888;
  font-style: italic;
}

.date {
  font-size: 14px;
}

.diary-content {
  line-height: 1.8;
  color: #444;
  white-space: pre-wrap;
  font-size: 16px;
  text-align: left;
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
  font-weight: 600;
  line-height: 1.25;
  color: #222;
}

.markdown-body :deep(h1) {
  font-size: 2em;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.3em;
}

.markdown-body :deep(h2) {
  font-size: 1.5em;
  padding-bottom: 0.3em;
}

.markdown-body :deep(p) {
  margin-bottom: 16px;
  line-height: 1.8;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 2em;
  margin-bottom: 16px;
}

.markdown-body :deep(li) {
  margin-bottom: 8px;
}

.markdown-body :deep(pre) {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 3px;
  margin-bottom: 16px;
}

.markdown-body :deep(code) {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(175, 184, 193, 0.2);
  border-radius: 3px;
  font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
}

.markdown-body :deep(pre code) {
  padding: 0;
  background-color: transparent;
}

.markdown-body :deep(blockquote) {
  padding: 0 1em;
  color: #57606a;
  border-left: 0.25em solid #d0d7de;
  margin: 0 0 16px 0;
}

.markdown-body :deep(img) {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 16px 0;
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
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 20px;
  background-color: #fff;
  max-height: 400px;
  overflow-y: auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .diary-detail {
    padding: 10px;
  }

  .content h1 {
    font-size: 22px;
  }

  .date {
    font-size: 12px;
  }

  .markdown-body :deep(h1) {
    font-size: 20px;
  }

  .markdown-body :deep(h2) {
    font-size: 18px;
  }

  .markdown-body :deep(h3) {
    font-size: 16px;
  }

  .markdown-body :deep(p),
  .markdown-body :deep(li),
  .markdown-body :deep(blockquote) {
    font-size: 14px;
    line-height: 1.6;
  }

  .markdown-body :deep(code),
  .markdown-body :deep(pre) {
    font-size: 12px;
  }

  .markdown-preview {
    padding: 12px;
  }
}
</style>