var mongoose = require('mongoose')

module.exports = mongoose.model('carts', mongoose.Schema({
  user_id: Object,  // 用户_id
  good_id: Object,  // 商品_id
  create_time: Number,  // 购买时间
  num: Number,        // 下单数量
  status: Number     // 1-正常， 0-已被删除
}))
