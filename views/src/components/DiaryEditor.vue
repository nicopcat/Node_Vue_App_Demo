<template>
  <div class="diary-editor">
    <div class="header">
      <el-button @click="goBack">返回</el-button>
      <h1>{{ isNew ? '写日记' : '编辑日记' }}</h1>
    </div>

    <div class="content" v-loading="loading">
      <el-form :model="formData" label-width="50px">
        <el-form-item label="标题">
          <el-input v-model="formData.title" placeholder="请输入日记标题" />
        </el-form-item>
        <el-form-item label="内容">
          <div class="markdown-tips">
            支持Markdown语法：**粗体**、*斜体*、# 标题、- 列表、```代码块、> 引用等
          </div>
          <el-input
            v-model="formData.content"
            type="textarea"
            :rows="15"
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
        <el-form-item>
          <el-button type="primary" @click="handleSave" :loading="submitting">
            {{ isNew ? '保存' : '更新' }}
          </el-button>
          <el-button @click="goBack">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getArticle, createArticle, updateArticle } from '@/api/article'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import { gfmHeadingId } from 'marked-gfm-heading-id'

// 配置marked
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
const loading = ref(false)
const submitting = ref(false)
const showPreview = ref(false)

// 判断是新增还是编辑
const isNew = computed(() => !route.params.id)

// 表单数据
const formData = reactive({
  title: '',
  content: '',
  _id: ''
})

// 预览时将编辑内容渲染为Markdown
const renderedPreview = computed(() => {
  if (!formData.content) return '';
  return safeMarked(formData.content);
})

// 获取日记详情（编辑模式）
const fetchDiary = async () => {
  const id = route.params.id
  if (!id) return

  try {
    loading.value = true
    const res = await getArticle(id)
    Object.assign(formData, res)
  } catch (err) {
    console.error(err)
    ElMessage.error('获取日记详情失败')
    router.push('/article')
  } finally {
    loading.value = false
  }
}

// 返回列表页
const goBack = () => {
  router.back()
}

// 保存日记
const handleSave = async () => {
  if (!formData.title.trim()) {
    ElMessage.warning('请输入日记标题')
    return
  }

  try {
    submitting.value = true
    const articleData = {
      title: formData.title.trim(),
      content: formData.content.trim()
    }

    if (isNew.value) {
      // 创建新日记
      await createArticle(articleData)
      ElMessage.success('日记创建成功')
    } else {
      // 更新日记
      await updateArticle(formData._id, articleData)
      ElMessage.success('日记更新成功')
    }
    
    // 返回列表页
    router.push('/article')
  } catch (err) {
    console.error(err)
    ElMessage.error(isNew.value ? '创建日记失败' : '更新日记失败')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  // 如果是编辑模式，获取日记详情
  if (!isNew.value) {
    fetchDiary()
  }
})
</script>

<style scoped>
.diary-editor {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fafafa;
  color: #333;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.header h1 {
  margin: 0 0 0 20px;
  font-size: 24px;
}

.content {
  padding: 0;
  text-align: left;
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
  max-height: 500px;
  overflow-y: auto;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .diary-editor {
    padding: 10px;
  }
  
  .header h1 {
    font-size: 20px;
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
