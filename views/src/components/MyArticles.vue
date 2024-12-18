<template>
  <div>
    <el-table :data="articles" style="width: 100%" v-loading="loading">
      <el-table-column prop="title" label="标题" width="180" />
      <el-table-column prop="author" label="作者" width="180" />
      <el-table-column prop="content" label="内容" />
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="edit(scope.row._id)">编辑</el-button>
          <el-button link type="primary" size="small" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <form>
        <label>题目</label> <input v-model="newData.title">
        <label>作者</label> <input v-model="newData.author">
        <label>内容</label> <textarea v-model="newData.content"></textarea>
        <button @click.prevent="submit">{{ isNew ? '新增' : '更新 ' }}</button>
      </form>
    </div>
  </div>
</template>
<script>
import { ElMessage, ElMessageBox } from 'element-plus'
import { getArticles, createArticle, updateArticle, deleteArticle } from '@/api/article'

export default {
  data() {
    return {
      articles: [],
      article: {
        title: '',
        author: '',
        content: ''
      },
      newData: {
        title: '',
        author: '',
        content: '',
      },
      loading: false,
      isNew: true,

    }
  },
  created() {
    this.getArticles();
  },
  methods: {
    async getArticles() {
      try {
        this.loading = true
        const res = await getArticles()
        console.log(res);

        this.articles = res.articles
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    
    async createArticle() {
      try {
        this.loading = true
        const res = await createArticle(this.newData)
        
        if (res.code === 200) {
          ElMessage({
            type: 'success',
            message: res.msg
          })
          this.newData = { title: '', author: '', content: '' }
          await this.getArticles()
        }
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async updateArticle(id) {
      try {
        this.loading = true
        const res = await updateArticle(id, this.newData)
        if (res.article) {
          this.newData = { title: '', author: '', content: '' }
          this.isNew = true
          await this.getArticles()
        }
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async del(row) {
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
        
        this.loading = true
        const res = await deleteArticle(row._id)
        if (res.code === 200) {
          ElMessage({
            type: 'success',
            message: res.msg,
          })
          await this.getArticles()
        }
      } catch (err) {
        if (err !== 'cancel') {
          console.error(err)
        }
      } finally {
        this.loading = false
      }
    },
    submit() {
      if (this.isNew) {
        this.createArticle();
      } else {
        this.updateArticle(this.article._id);
      }
    },
    edit(id) {
      const article = this.articles.find(a => a._id === id);
      this.article = { ...article };
      this.newData = { ...article };
      this.isNew = false;
    },
  }
}
</script>
<style>
table {
  border-collapse: collapse;
  width: 100%;
}

td,
th {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}

form {
  display: flex;
  flex-direction: column;
}

textarea {
  height: 100px;
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
