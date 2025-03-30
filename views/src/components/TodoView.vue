<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getTodos, createTodo, updateTodo, deleteTodo } from '@/api/todo'
import { ElMessage } from 'element-plus'

const todos = ref([])


const isEdit = ref(false)
const editTodo = ref({
  task: '',
  importance: 0,
  completed: false
})


const fetchTodos = async () => {
  const res = await getTodos()
  todos.value = res.todos || []
}

const openEditDialog = async () => {
  editTodo.value.task = ''
  isEdit.value = true
}

const addTodo = async (task: string) => {
  console.log('editTodo', editTodo.value);

  if (editTodo.value.task) {
    // 更新 
    await updateTodo(editTodo.value._id, { task: editTodo.value.task })
    ElMessage.success('更新成功')
  } else {
    // 新增
    await createTodo({ task })
    ElMessage.success('新增成功')
  }
  isEdit.value = false
  fetchTodos()
}

const handleEditTodo = async (id: string, todo: any) => {
  isEdit.value = true
  editTodo.value = todo
}

const handleDeleteTodo = async (id: string) => {
  await deleteTodo(id)
  ElMessage.success('删除成功')
  fetchTodos()
}

const handleCompleted = async (id: string, completed: boolean) => {
  await updateTodo(id, { completed })
  ElMessage.success('更新成功')
  fetchTodos()
}
const handleEditTask = async (id: string, task: string) => {
  await updateTodo(id, { task })
  ElMessage.success('更新成功')
  isInlineEdit.value = false
  fetchTodos()
}

const isInlineEdit = ref(false)

onMounted(() => {
  fetchTodos()
})
</script>

<template>
  <div>
    <h1>代办列表</h1>
    <el-button type="primary" @click="openEditDialog">添加</el-button>
    <el-table :data="todos">
      <el-table-column prop="task" label="任务" width="350" show-overflow-tooltip>
        <template #default="scope">
          <span style="width: 100%;" v-if="!isInlineEdit"
            @click="isInlineEdit = true" @blur="isInlineEdit = false">{{
              scope.row.task }}</span>
          <div v-else
            style="display: flex; flex-flow: row nowrap; align-items: center;">
            <el-input v-model="scope.row.task" />
            <el-button style="margin: 10px;" v-if="isInlineEdit" size="small"
              type="primary"
              @click="handleEditTask(scope.row._id, scope.row.task)">save</el-button>
          </div>

        </template>
      </el-table-column>
      <el-table-column prop="completed" label="完成">
        <template #default="scope">
          <el-switch v-model="scope.row.completed"
            @change="handleCompleted(scope.row._id, scope.row.completed)" />
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" />
      <el-table-column prop="updatedAt" label="更新时间" />
      <el-table-column fixed="right" label="Operations" min-width="120">
        <template #default="scope">
          <el-button link type="primary" size="small"
            @click="handleEditTodo(scope.row._id, scope.row)">
            编辑
          </el-button>
          <el-button link type="primary" size="small"
            @click="handleDeleteTodo(scope.row._id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="编辑任务" v-model="isEdit" :width="400" :height="400">
      <el-form :model="editTodo" label-width="120px">
        <el-form-item label="任务">
          <el-input v-model="editTodo.task" />
        </el-form-item>

      </el-form>
      <template #footer>
        <el-button type="primary" @click="addTodo(editTodo.task)">确定</el-button>
        <el-button type="primary" @click="isEdit = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped></style>
