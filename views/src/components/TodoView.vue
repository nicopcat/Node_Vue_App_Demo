<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getTodos, createTodo, updateTodo, deleteTodo } from '@/api/todo'
import { ElMessage } from 'element-plus'

const todos = ref([])
const activeTab = ref('active')
const isEdit = ref(false)
const editingId = ref('')
const isSubmitting = ref(false)
const isLoading = ref(false)
const isSaving = ref(false)
const editTodo = ref({
  task: '',
  importance: 0,
  completed: false
})

// 计算属性：根据标签页筛选待办事项
const filteredTodos = computed(() => {
  const filtered = todos.value.filter(todo => {
    if (activeTab.value === 'active') {
      return !todo.completed;
    } else {
      return todo.completed;
    }
  });
  return filtered;
})

const fetchTodos = async () => {
  isLoading.value = true
  try {
    const res = await getTodos();
    console.log('Fetched todos:', res);
    todos.value = res || [];
  } finally {
    isLoading.value = false
  }
}

const openEditDialog = async () => {
  editTodo.value.task = ''
  isEdit.value = true
}

const addTodo = async (task: string) => {
  if (isSubmitting.value) return
  
  isSubmitting.value = true
  try {
    console.log('addTodo', editTodo.value);
    
    if (editTodo.value._id) {
      await updateTodo(editTodo.value._id, { task })
      ElMessage.success('更新成功')
    } else {
      await createTodo(editTodo.value)
      ElMessage.success('新增成功')
    }
    isEdit.value = false
    fetchTodos()
  } finally {
    isSubmitting.value = false
  }
}

const handleEditTodo = async (id: string, todo: any) => {
  editingId.value = id
  editTodo.value = { ...todo }
}

const handleSaveEdit = async () => {
  if (isSaving.value) return
  
  if (editTodo.value.task.trim()) {
    isSaving.value = true
    try {
      await updateTodo(editingId.value, { 
        task: editTodo.value.task,
        completed: editTodo.value.completed
      })
      ElMessage.success('更新成功')
      editingId.value = ''
      fetchTodos()
    } finally {
      isSaving.value = false
    }
  } else {
    ElMessage.warning('任务内容不能为空')
  }
}

const handleCancelEdit = () => {
  editingId.value = ''
  editTodo.value = {
    task: '',
    importance: 0,
    completed: false
  }
}

const handleDeleteTodo = async (id: string) => {
  await deleteTodo(id)
  ElMessage.success('删除成功')
  fetchTodos()
}

const handleCompleted = async (id: string, completed: boolean) => {
  console.log('handleCompleted 被调用:', { id, completed });
  
  try {
    await updateTodo(id, { completed })
    ElMessage.success('更新成功')
    await fetchTodos()
  } catch (error) {
    console.error('更新状态失败:', error)
    ElMessage.error('更新状态失败')
  }
}

onMounted(() => {
  fetchTodos()
})
</script>

<template>
  <div class="todo-container">
    <h1>待办事项</h1>
    
    <!-- 添加按钮 -->
    <div class="header">
      <el-button type="primary" @click="openEditDialog">添加待办</el-button>
    </div>

    <!-- 标签页 -->
    <el-tabs v-model="activeTab" class="todo-tabs">
      <el-tab-pane label="进行中" name="active">
        <div class="todo-list">
          <el-skeleton :rows="3" animated v-if="isLoading" />
          <div v-else-if="filteredTodos.length === 0" class="empty-state">
            暂无进行中的任务
          </div>
          <div v-else v-for="todo in filteredTodos" :key="todo._id" class="todo-item">
            <el-checkbox 
              :model-value="todo.completed"
              @update:model-value="(val) => handleCompleted(todo._id, val)"
            />
            <div class="todo-content">
              <template v-if="editingId === todo._id">
                <el-input 
                  v-model="editTodo.task" 
                  placeholder="请输入任务内容"
                  @keyup.enter="handleSaveEdit"
                />
              </template>
              <template v-else>
                <span class="todo-text" @click="handleEditTodo(todo._id, todo)">{{ todo.task }}</span>
              </template>
            </div>
            <div class="todo-actions">
              <template v-if="editingId === todo._id">
                <el-button 
                  link 
                  type="primary" 
                  @click.stop="handleSaveEdit"
                  :loading="isSaving"
                  :disabled="isSaving"
                >保存</el-button>
                <el-button 
                  link 
                  @click="handleCancelEdit"
                  :disabled="isSaving"
                >取消</el-button>
              </template>
              <template v-else>
                <el-button link type="primary" @click.stop="handleEditTodo(todo._id, todo)">编辑</el-button>
                <el-button link type="danger" @click="handleDeleteTodo(todo._id)">删除</el-button>
              </template>
            </div>
          </div>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="已完成" name="completed">
        <div class="todo-list">
          <el-skeleton :rows="3" animated v-if="isLoading" />
          <div v-else-if="filteredTodos.length === 0" class="empty-state">
            暂无已完成的任务
          </div>
          <div v-else v-for="todo in filteredTodos" :key="todo._id" class="todo-item">
            <el-checkbox 
              :model-value="todo.completed"
              @update:model-value="(val) => handleCompleted(todo._id, val)"
            />
            <div class="todo-content">
              <template v-if="editingId === todo._id">
                <el-input 
                  v-model="editTodo.task" 
                  placeholder="请输入任务内容"
                  @keyup.enter="handleSaveEdit"
                />
              </template>
              <template v-else>
                <span class="todo-text completed" @click="handleEditTodo(todo._id, todo)">{{ todo.task }}</span>
              </template>
            </div>
            <div class="todo-actions">
              <template v-if="editingId === todo._id">
                <el-button 
                  link 
                  type="primary" 
                  @click.stop="handleSaveEdit"
                  :loading="isSaving"
                  :disabled="isSaving"
                >保存</el-button>
                <el-button 
                  link 
                  @click="handleCancelEdit"
                  :disabled="isSaving"
                >取消</el-button>
              </template>
              <template v-else>
                <el-button link type="primary" @click.stop="handleEditTodo(todo._id, todo)">编辑</el-button>
                <el-button link type="danger" @click="handleDeleteTodo(todo._id)">删除</el-button>
              </template>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 编辑对话框 -->
    <el-dialog 
      :title="editTodo._id ? '编辑任务' : '新增任务'" 
      v-model="isEdit" 
      width="400px"
    >
      <el-form :model="editTodo" label-width="80px">
        <el-form-item label="任务">
          <el-input v-model="editTodo.task" placeholder="请输入任务内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isEdit = false" :disabled="isSubmitting">取消</el-button>
          <el-button 
            type="primary" 
            @click="addTodo(editTodo.task)"
            :loading="isSubmitting"
            :disabled="isSubmitting"
          >确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.todo-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
  h1{
    color: #333;
    font-size: 32px;
  }
}

.header {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
}

.todo-tabs {
  margin-top: 20px;
}

.todo-list {
  /* margin-top: 20px; */
}

.todo-item {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #eee;
  gap: 10px;
}

.todo-content {
  flex: 1;
  margin: 0 10px;
}

.todo-text {
  color: #333;
  text-align: start;
  cursor: pointer;
  display: block;
  padding: 4px 8px;
  border-radius: 4px;
}

.todo-text:hover {
  background-color: #f5f7fa;
}

.todo-text.completed {
  text-decoration: line-through;
  color: #999;
}

.todo-actions {
  display: flex;
  gap: 10px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.empty-state {
  text-align: center;
  color: #999;
  padding: 20px;
}

:deep(.el-input) {
  width: 100%;
}
</style>
