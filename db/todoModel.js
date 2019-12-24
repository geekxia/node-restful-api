var mongoose = require('mongoose')

var todoModel = mongoose.model('todos', mongoose.Schema({
  userId: String,   // 学号
  task: String,     // 任务名称
  status: String,   // 0-未完成  1-已完成
  createTime: Number
}))

module.exports = todoModel
