var mongoose = require('mongoose')

var articleModel = mongoose.model('articles', mongoose.Schema({
  username: String,
  title: String,
  content: String,
  createTime: Number
}))

module.exports = articleModel
