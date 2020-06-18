var mongoose = require('mongoose')

module.exports = mongoose.model('jdorders', mongoose.Schema({
  order_no: String,
  create_time: Number,
  goods: Array  // [{good_id, price, num}]
}))
