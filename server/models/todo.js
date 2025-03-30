const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema({
  task: { type: String, required: true }, // 任务
  importance: { type: Number, required: false }, // 重要性
  completed: { type: Boolean, required: false }, // 是否完成
  created_at: Date, // 创建时间
  updated_at: Date // 更新时间
}, { timestamps: true });


module.exports = mongoose.model('Todos', todoSchema) ;