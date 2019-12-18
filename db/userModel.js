var mongoose = require('mongoose')

var userModel = mongoose.model('users', mongoose.Schema({
  username: String,
  password: String,
  createTime: Number
}))

module.exports = userModel
