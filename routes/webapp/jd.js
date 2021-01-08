var express = require('express');
var router = express.Router();
var goodModel = require('../../model/goods')
var cateModel = require('../../model/cates')
var jwt = require('../../utils/jwt')
var userModel = require('../../model/users')
var cartModel = require('../../model/carts')

// 获取所有品类
router.get('/cates', function(req, res) {
  cateModel.find({}).then(list=>{
    res.json({err: 0, msg: 'success', data: {list}})
  })
})


// 查询商品详情
router.get('/good/detail', function(req, res){
  var { id } = req.query
  goodModel.find({_id: id}).then(arr=>{
    res.json({err: 0, msg: 'success', data: arr[0]})
  })
})

// 商品列表查询
router.get('/good/list', function(req, res) {
  var { size, page, cate, hot } = req.query
  // 用于查询
  var params = {
    cate: (cate || ''),
    hot: (hot || false)
  }
  if(!params.cate) delete params.cate
  if(!params.hot) delete params.hot
  console.log('params', params)
  // 用户分页
  size = parseInt(size || 10)
  page = parseInt(page || 1)
  // 查询总条数
  goodModel.find(params).count().then(total=>{
    console.log('total', total)
    // 查询当前页
    goodModel.find(params).limit(size).skip(size*(page-1)).sort({rank: -1}).then(list=>{
      res.json({err:0, msg:'success', data: {total, list}})
    })
  })
})


// ============================================================
// 以下是复制过来的购物车接口
// 购物车必须经过token验证
// ============================================================


// 加入购物车(token)
router.post('/cart/add', function(req, res) {
  let { num, good_id } = req.body

  num = num || 1
  if (!good_id) return res.json({err: 2, msg: 'good_id商品id是必填参数'})

  // 验证用户身份
  jwt.verifyToken(req, res).then(user=>{
    userModel.find(user).then(arr=>{
      let item = {
        user_id: arr[0]._id,  // 用户id
        good_id,   // 商品id
        num,
        create_time: Date.now(),
        status: 1
      }
  
      // 入参还要判断，如果在 carts 中已经存在了当前 good_id，直接num++即可，无须重复添加
      cartModel.find({good_id, user_id: item.user_id}).then(arr1=>{
        if (arr1.length == 0) {
          cartModel.insertMany([item]).then(()=>{
            res.json({err:0,msg:'加入购物车成功', data: 1})
          })
        } else {
          cartModel.updateOne({good_id, user_id: item.user_id}, {num: arr1[0].num+1}).then(()=>{
            res.json({err:0,msg:'加入购物车成功', data: 1})
          })
          
        }
      })
    })
  })
})

// 获取购物车列表
router.get('/cart/list', function(req, res, next) {
  let { page, size } = req.query

  page = parseInt(page||1)
  size = parseInt(size||1000)

  jwt.verifyToken(req, res).then(user=>{
    userModel.find(user).then((userArr)=>{
      // -1 按时间从大到小
      cartModel.find({status:1, user_id: userArr[0]._id}).limit(size).skip((page-1)*size).sort({create_time: -1}).then(arr1=>{
        if(arr1.length==0) return res.json({err:0, msg:'success', data: []})
        let list = []
        // 遍历获取商品信息，一起传递给购物车列表
        arr1.map((ele,idx)=>{
          goodModel.find({_id: ele.good_id}).then(arr2=>{
            list.push({
              _id: ele._id,
              good_id: ele.good_id,
              create_time: ele.create_time,
              user_id: ele.user_id,
              num: ele.num,
              status: ele.status,
              good: arr2[0]
            })
            if (list.length == arr1.length) {
              res.json({err:0,msg:'success',data:list})
            }
          })
        })
      })
    })
  })
})

// 改变购物车商品数量
router.post('/cart/update', function(req, res, next) {
  let { num, id } = req.body

  console.log('--zxc', num, id)

  if (!num) return res.json({err:-1, msg:'num是必填参数'})
  if (num < 1) return res.json({err:-1, msg:'num不能小于1'})
  if (!id) return res.json({err:-1, msg:'id是必填参数'})

  jwt.verifyToken(req, res).then(user=>{
    cartModel.updateOne({_id: id}, {num}).then(()=>{
      res.json({err:0,msg:'成功'})
    })
  })
})

// 删除购物车商品
router.get('/cart/del', function(req, res, next) {
  let { id } = req.query

  if (!id) return res.json({err: -1, msg:'id是必填参数'})

  jwt.verifyToken(req, res).then(user=>{
    cartModel.deleteMany({_id: id}).then(()=>{
      res.json({err:0,msg:'删除成功'})
    })
  })
})

// 提交购物车
router.post('/cart/submit', function(req, res, next) {
  let { goods } = req.body

  // goods是用 ; 连接起来的 _id的字符串，不能用数组进行传递
  if (!goods) return res.json({err: -1, msg: 'goods是必填参数'})

  let goodIdArr = goods.split(';')
  goodIdArr.map((ele,idx)=>{
    if (!ele) goodIdArr.splice(idx,1)
  })

  jwt.verifyToken(req, res).then(user=>{
    let count = 0
    goodIdArr.map(ele=>{
      cartModel.deleteMany({_id: ele}).then(()=>{
        count++
        if (count == goodIdArr.length) {
          res.json({err:0, msg:'下单成功'})
          // 向'订单'集合中插入一条订单记录
        }
      })
    })
  })
})

module.exports = router;
