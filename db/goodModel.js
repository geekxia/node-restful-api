var mongoose = require('mongoose')

var goodModel = mongoose.model('goods', mongoose.Schema({
  src: String,
  name: String,
  price: Number,
  visit_num: Number,
  browse_num: Number,
  inventory_num: Number,
  sale_num: Number,
  order: Number,
  create_time: Number,
  status_no: Number,
  status_zh: String,
  group_no: Number,
  group_zh: String,
  type_no: Number,
  type_zh: String,
  deduction_no: Number,
  deduction_zh: String
}))

module.exports = goodModel
