const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema({
  task: { type: String, required: true }, // 任务
  importance: { type: Number, required: false }, // 重要性
  completed: { type: Boolean, default: false }, // 是否完成
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // 用户ID
  created_at: Date, // 创建时间
  updated_at: Date // 更新时间
}, { timestamps: true });

module.exports = mongoose.model('Todos', todoSchema);