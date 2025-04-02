const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// 用户注册
router.post('/register', async (req, res) => {
  console.log('注册');
  console.log(req.body);
  try {
    const { username, password, confirmPassword } = req.body;

    // 验证密码是否一致
    if (password !== confirmPassword) {
      return res.status(400).json({ code: 400, msg: '两次输入的密码不一致' });
    }

    // 检查用户名是否已存在
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ code: 400, msg: '用户名已存在' });
    }

    // 创建新用户
    const user = new User({
      username,
      password
    });

    await user.save();
    res.json({ code: 200, msg: '注册成功' });
  } catch (err) {
    console.log('注册错误:', err);
    res.status(500).json({ code: 500, msg: '注册失败，请稍后重试' });
  }
});

// 用户登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 查找用户
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ code: 401, msg: '用户名或密码错误' });
    }

    // 验证密码
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ code: 401, msg: '用户名或密码错误' });
    }

    // 生成 JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      code: 200,
      msg: '登录成功',
      data: {
        token,
        user: {
          id: user._id,
          username: user.username
        }
      }
    });
  } catch (err) {
    console.log('登录错误:', err);
    res.status(500).json({ code: 500, msg: '登录失败，请稍后重试' });
  }
});

module.exports = router; 