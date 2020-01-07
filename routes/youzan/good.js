var express = require('express');
var router = express.Router();
var goodModel = require('../../db/goodModel')

router.post('/createGood', function(req, res, next) {
  let { src, name, price, visit_num, browse_num, inventory_num, sale_num, order, status_no, group_no, type_no, deduction_no } = req.body
  var good = {
    src,
    name,
    price,
    visit_num,
    browse_num,
    inventory_num,
    sale_num,
    order,
    status_no,
    group_no,
    type_no,
    deduction_no,
    create_time: Date.now()
    // status_zh: '销售中',
    // group_zh: '热销商品',
    // type_zh: '实体商品',
    // deduction_zh: '拍下扣减库存'
  }
  goodModel.insertMany([good]).then(()=>{
    res.json({err:0, msg:'商品新增成功'})
  })
})

router.get('/getGoodList', function(req, res, next) {

  let { name, group_no, type_no, deduction_no, status_no } = req.query
  let { page, size, sale_max, sale_min, price_max, price_min } = req.query

  // 数据验证与处理
  name = name || ''
  group_no = group_no ? parseInt(group_no) : -1
  type_no = type_no ? parseInt(type_no) : -1
  deduction_no = deduction_no ? parseInt(deduction_no) : -1
  status_no = status_no ? parseInt(status_no) : -1
  page = page ? parseInt(page) : 1
  if (page < 1) page = 1
  size = size ? parseInt(size) : 5
  sale_max = sale_max ? parseInt(sale_max) : 100000
  sale_min = sale_min ? parseInt(sale_min) : 0
  price_max = price_max ? parseFloat(price_max) : 1000000
  price_min = price_min ? parseFloat(price_min) : 0


  var params = {
    group_no, type_no, deduction_no, status_no,
    name,
    price: { $gte: price_min, $lte: price_max },
    sale_num: { $gte: sale_min, $lte: sale_max }
  }
  if (!params.name) delete params.name
  if (group_no < 0) delete params.group_no
  if (type_no < 0) delete params.type_no
  if (deduction_no < 0) delete params.deduction_no
  if (status_no <= 0) delete params.status_no

  goodModel.find(params).count().then((total)=>{
    console.log('========================',total)
    goodModel.find(params).limit(size).skip((page-1)*size).sort({create_time:-1}).then(arr=>{
      res.json({err:0, data: {total, list: arr}})
    })
  })
})

module.exports = router;
