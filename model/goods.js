var mongoose = require('mongoose')

module.exports = mongoose.model('goods', new mongoose.Schema({
  name: String, // 商品名称
  img: String,  // 商品图片
  price: String,// 销售价格
  desc: String, // 商品描述
  cate: String, // 所属品类
  rank: Number, // 竞价排名
  create_time: Number, // 入库时间
  hot: Boolean  // 是否热销
}))
