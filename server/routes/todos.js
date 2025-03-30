// 我们将在该文件中定义文章相关的路由处理逻辑
const express = require('express');
const router = express.Router();
const Todos = require('../models/todo');

// 获取代办列表

router.get('/', (req, res) => {
  Todos.find().sort({ createdAt: -1 }).then((todos) => {
    // 格式化 createdAt
    const formattedTodos = todos.map(todo => {
      const createdAt = new Date(todo.createdAt);
      const formattedDate = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}-${String(createdAt.getDate()).padStart(2, '0')}`;
      const updatedAt = new Date(todo.updatedAt);
      const formattedUpdatedAt = `${updatedAt.getFullYear()}-${String(updatedAt.getMonth() + 1).padStart(2, '0')}-${String(updatedAt.getDate()).padStart(2, '0')}`; 
      return {
        ...todo.toObject(), // 转换为普通对象
        createdAt: formattedDate, // 替换为格式化后的日期
        updatedAt: formattedUpdatedAt // 替换为格式化后的日期
      };
    });

    res.json({ todos: formattedTodos });
  }).catch((err) => {
    console.log(err);
  });
});


// 获取单个代办
router.get('/:id', (req, res) => {
  Todos.findById(req.params.id).then(todo => {
    res.json({ todo });
   }).catch((err) => {
    console.log(err);
  })
});

// 新增代办
router.post('/add', (req, res) => {
  console.log(req.body);
  const todo = new Todos(req.body);
  todo.save()
      .then(() => res.json({ code:200, msg: '新增成功' }))
      .catch(err => console.log(err));
});

// 更新代办
router.put('/:id', (req, res) => {
  console.log('updateTodo',req.body);
  Todos.findByIdAndUpdate(req.params.id, req.body, { new: true }).then(todo => {
    res.json({ todo });
  }).catch(err => {
    console.log(err);
    res.status(500).json({ error: 'An error occurred while updating the todo.' });
  });
});

// 删除代办
router.delete('/:id', (req, res) => {
  Todos.findByIdAndDelete(req.params.id ).then(r => {
    res.json({code:200, msg: '删除成功'});
   }).catch((err) => {
    console.log(err);
  })
});

module.exports = router;