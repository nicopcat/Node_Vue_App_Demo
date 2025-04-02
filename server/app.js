const express = require('express');
const bodyParse = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config()
const articlesRouter = require('./routes/articles');
const todosRouter = require('./routes/todos');
const usersRouter = require('./routes/users');
const path = require('path');


const app = express();
app.use(bodyParse.json());

mongoose.connect(process.env.dbURI);
mongoose.connection.once('open', ()=>{
  console.log('connected to db');
});

// 使用 cors 包
const cors = require('cors');
app.use(cors({
  origin: ['https://node-demo-client.vercel.app', 'http://localhost:8080'], //线上
  // origin: ['http://localhost:5173', 'http://localhost:3000'], //本地
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// routes
app.use('/articles', articlesRouter);
app.use('/todos', todosRouter);
app.use('/api/user', usersRouter);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname+'/index.html'))
});
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT)
})