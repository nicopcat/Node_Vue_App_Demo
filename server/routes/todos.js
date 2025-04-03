// 我们将在该文件中定义文章相关的路由处理逻辑
const express = require('express');
const router = express.Router();
const Todo = require('../models/todo');
const { verifyToken } = require('../middleware/auth');
const { success, error } = require('../utils/response');

// 获取当前用户的所有 todos
router.get('/', verifyToken, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.userId });
    res.json(success(todos, '获取待办事项成功'));
  } catch (err) {
    res.status(500).json(error('获取待办事项失败'));
  }
});

// 创建新的 todo
router.post('/add', verifyToken, async (req, res) => {
  const todo = new Todo({
    task: req.body.task,
    importance: req.body.importance,
    completed: req.body.completed,
    userId: req.userId // 从 token 中获取用户 ID
  });

  try {
    const newTodo = await todo.save();
    res.status(201).json(success(newTodo, '创建待办事项成功'));
  } catch (err) {
    res.status(400).json(error('创建待办事项失败'));
  }
});

// 更新 todo
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, userId: req.userId });
    if (!todo) {
      return res.status(404).json(error('待办事项不存在', 404));
    }

    if (req.body.task) todo.task = req.body.task;
    if (req.body.importance !== undefined) todo.importance = req.body.importance;
    if (req.body.completed !== undefined) todo.completed = req.body.completed;

    const updatedTodo = await todo.save();
    res.json(success(updatedTodo, '更新待办事项成功'));
  } catch (err) {
    res.status(400).json(error('更新待办事项失败'));
  }
});

// 删除 todo
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.userId 
    });
    if (!todo) {
      return res.status(404).json(error('待办事项不存在', 404));
    }
    res.json(success(null, '删除待办事项成功'));
  } catch (err) {
    res.status(500).json(error('删除待办事项失败'));
  }
});

module.exports = router;