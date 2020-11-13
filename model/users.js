var mongoose = require('mongoose')

// 创建users集合所构建一个model，这个model对象上有增删改查的api
// 集合名称，一定要用英文的复数
module.exports = mongoose.model('users', new mongoose.Schema({
  username: String,
  password: String,
  create_time: Number,
  role: String,
  mobile: String,
  avatar: String
}))
