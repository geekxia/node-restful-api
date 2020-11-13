var mongoose = require('mongoose')

// 创建users集合所构建一个model，这个model对象上有增删改查的api
// 集合名称，一定要用英文的复数
module.exports = mongoose.model('ads', new mongoose.Schema({
  img: String,
  desc: String,
  title: String,
  create_time: Number
}))
