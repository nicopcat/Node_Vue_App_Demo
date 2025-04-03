const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//我们定义一个名为"Article"的数据模型，并定义了相应的数据结构。
const articleSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  created_at: Date,
  updated_at: Date
}, { timestamps: true });


module.exports = mongoose.model('Article', articleSchema) ;