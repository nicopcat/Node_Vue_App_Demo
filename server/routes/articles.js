// 我们将在该文件中定义文章相关的路由处理逻辑
const express = require('express');
const router = express.Router();
const Article = require('../models/article');
const { success, error } = require('../utils/response');
const { verifyToken } = require('../middleware/auth');

// 获取文章列表
router.get('/', verifyToken, (req, res) => {
  Article.find({ userId: req.userId }).sort({ createdAt: -1 }).then((articles) => {
    res.json(success(articles, '获取文章列表成功'));
  }).catch((err) => {
    console.log(err);
    res.status(500).json(error('获取文章列表失败'));
  });
});

// 获取单篇文章
router.get('/:id', verifyToken, (req, res) => {
  Article.findOne({ _id: req.params.id, userId: req.userId }).then(article => {
    if (!article) {
      return res.status(404).json(error('文章不存在', 404));
    }
    res.json(success(article, '获取文章成功'));
  }).catch((err) => {
    console.log(err);
    res.status(500).json(error('获取文章失败'));
  });
});

// 新增文章
router.post('/add', verifyToken, (req, res) => {
  console.log(req.body);
  const article = new Article({
    ...req.body,
    userId: req.userId
  });
  article.save()
    .then(() => res.json(success(null, '新增文章成功')))
    .catch(err => {
      console.log(err);
      res.status(500).json(error('新增文章失败'));
    });
});

// 更新文章
router.put('/:id', verifyToken, (req, res) => {
  Article.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    req.body,
    { new: true }
  )
    .then(article => {
      if (!article) {
        return res.status(404).json(error('文章不存在', 404));
      }
      res.json(success(article, '更新文章成功'));
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(error('更新文章失败'));
    });
});

// 删除文章
router.delete('/:id', verifyToken, (req, res) => {
  Article.findOneAndDelete({ _id: req.params.id, userId: req.userId })
    .then(article => {
      if (!article) {
        return res.status(404).json(error('文章不存在', 404));
      }
      res.json(success(null, '删除文章成功'));
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(error('删除文章失败'));
    });
});

module.exports = router;