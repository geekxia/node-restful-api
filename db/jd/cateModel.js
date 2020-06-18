var mongoose = require('mongoose')

module.exports = mongoose.model('jdcates', mongoose.Schema({
  rank: Number, // 排序
  cate: String, // 英文字段
  cate_zh: String  // 中文字符
}))
