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
      isNew: true
    }
  },
  created() {
    this.getArticles();
  },
  methods: {
    getArticles() {
      this.loading = true
      fetch('/api/articles')
        .then(res =>
          res.json()
        )
        .then(data => {
          this.articles = data.articles
        })
        .catch(err => console.log(err))
        .finally(() => this.loading = false);
    },
    createArticle() {
      this.loading = true
      fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.newData)
      })
        .then(res => res.json())
        .then(data => {
          if (data.code === 200) {
            ElMessage({
              type: 'success',
              message: data.msg
            })
            this.newData = { title: '', author: '', content: '' };
            this.getArticles();
          }
        })
        .catch(err => console.log(err))
        .finally(() => this.loading = false);
    },
    updateArticle(id) {
      this.loading = true

      fetch(`/api/articles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.newData)
      })
        .then(res => res.json())
        .then(data => {
          if (data.article) {
            this.newData = { title: '', author: '', content: '' };
            this.isNew = true;
            this.getArticles();
          }
        })
        .catch(err => console.log(err));
    },
    deleteArticle(id) {
      this.loading = true

      fetch(`/api/articles/${id}`, {
        method: 'DELETE'
      })
        .then(res => res.json())
        .then(data => {
          if (data.article) {
            this.getArticles();
          }
        })
        .catch(err => console.log(err))
        .finally(() => this.loading = false);
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
    del(row) {
      ElMessageBox.confirm(
        `确定要删除文章《${row.title}》?`,
        'Warning',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          this.loading = true

          fetch(`/api/articles/${row._id}`, {
            method: 'DELETE'
          })
            .then(res => res.json())
            .then(data => {
              if (data.code === 200) {
                ElMessage({
                  type: 'success',
                  message: data.msg,
                })
                this.getArticles();
              }
            })
            .catch(err => console.log(err));
        })
        .catch(() => {
        })
        .finally(() => this.loading = false);
    }
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
