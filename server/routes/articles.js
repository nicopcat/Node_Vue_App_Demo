// 我们将在该文件中定义文章相关的路由处理逻辑
const express = require('express');
const router = express.Router();
const Article = require('../models/article');

// 获取文章列表
router.get('/', (req, res) => {
  Article.find().sort({ createdAt: -1 }).then((articles) => {
    // 处理查询到的文章数据
    res.json({ articles});
  }).catch((err) => {
    console.log(err);
  });
});


// 获取单篇文章
router.get('/:id', (req, res) => {
  Article.findById(req.params.id).then(article => {
    res.json({ article });
   }).catch((err) => {
    console.log(err);
  })
});

// 新增文章
router.post('/add', (req, res) => {
  console.log(req.body);
  const article = new Article(req.body);
  article.save()
      .then(() => res.json({ code:200, msg: '新增成功' }))
      .catch(err => console.log(err));
});

// 更新文章
router.put('/:id', (req, res) => {
  Article.findByIdAndUpdate(req.params.id, req.body, { new: true }).then(article => {
    res.json({ article });
  }).catch(err => {
    console.log(err);
    res.status(500).json({ error: 'An error occurred while updating the article.' });
  });
});

// 删除文章
router.delete('/:id', (req, res) => {
  Article.findByIdAndDelete(req.params.id ).then(r => {
    res.json({code:200, msg: '删除成功'});
   }).catch((err) => {
    console.log(err);
  })
});

module.exports = router;