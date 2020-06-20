var express = require('express');
var router = express.Router();
var jwt = require('../utils/jwt')
var goodModel = require('../db/jd/goodModel')
var cateModel = require('../db/jd/cateModel')
var cartModel = require('../db/jd/cartModel')
var orderModel = require('../db/jd/orderModel')


/*
* 商品管理 =============================================================
*/

// 添加商品（不作token验证）
router.post('/addGood', function(req, res, next) {
  let { img, name, desc, price, cate, hot, rank } = req.body

  if(!img) return res.json({err:-1, msg:'img是必填参数'})
  if(!name) return res.json({err:-1, msg:'name是必填参数'})
  if(!desc) return res.json({err:-1, msg:'desc是必填参数'})
  if(!price) return res.json({err:-1, msg:'price是必填参数'})
  if(!cate) return res.json({err:-1, msg:'cate是必填参数'})

  hot = hot || false
  rank = rank || Math.floor(Math.random()*10000)
  let create_time = Date.now()

  goodModel.insertMany([{ img, name, desc, price, cate, hot, rank, create_time }]).then(()=>{
    res.json({err: 0, msg:'商品添加成功'})
  }).catch(err=>{
    res.json({err:-1, msg:'商品添加失败'})
  })
})


/* 获取推荐商品（不作token验证） */
router.get('/getHotGoodList', function(req, res, next) {
  let { hot, page, size } = req.query

  hot = hot || false;
  page = parseInt(page||1)
  size = parseInt(size||10)

  goodModel.find({hot}).limit(size).skip((page-1)*size).sort({rank: -1}).then(arr=>{
    res.json({err:0,msg:'success', data:arr})
  }).catch(err=>{
    res.json({err:1,msg:'fail',err})
  }) 
})

// 获取商品详情
router.get('/getGoodDetail', function(req, res, next) {
  let { good_id } = req.query
  if(!good_id) return res.json({err:1,msg:'商品id就必填参数'})
  goodModel.find({_id:good_id}).then(arr=>{
    res.json({err:0, msg:'success', data: arr[0]})
  })
})

// 获取全部品类
router.get('/getAllCates', function(req, res, next) {
  // 1 由小到大
  cateModel.find({}).sort({rank: 1}).then(arr=>{
    res.json({err:0,msg:'success',data:arr})
  }).catch(err=>{
    res.json({err:1,msg:'fail',err})
  })
})

// 基于品类筛选（不验证token）
router.get('/getCateGoodList', function(req, res, next) {
  let { cate, page, size } = req.query

  cate = cate || ''
  page = parseInt(page||1)
  size = parseInt(size||1000)

  let params = {cate}
  if (!cate) delete params.cate

  goodModel.find(params).limit(size).skip((page-1)*size).sort({rank: -1}).then(arr=>{
    res.json({err:0,msg:'success',data:arr})
  }).catch(err=>{
    res.json({err:1,msg:'fail',err})
  })
})


/*
* 购物管理 =============================================================
*/

// 加入购物车
router.post('/addToCart', function(req, res, next) {
  let { num, good_id } = req.body

  num = num || 1
  if (!good_id) return res.json({err: -1, msg: 'good_id商品id是必填参数'})

  jwt.verifyToken(req, res).then(arr=>{
    let item = {
      user_id: arr[0]._id,  // 用户id
      good_id,   // 商品id
      num,
      create_time: Date.now(),
      status: 1
    }

    // 入参还要判断，如果在 jdcarts 中已经存在了当前 good_id，直接num++即可，无须重复添加
    cartModel.find({good_id, user_id: item.user_id}).then(arr1=>{
      if (arr1.length == 0) {
        cartModel.insertMany([item]).then(()=>{
          res.json({err:0,msg:'加入购物车成功'})
        })
      } else {
        cartModel.updateOne({good_id, user_id: item.user_id}, {num: arr1[0].num+1}).then(()=>{
          res.json({err:0,msg:'加入购物车成功'})
        })
        
      }
    })
  }).catch(err=>{
    res.json({err:1,msg:'fail',err})
  })
})

// 获取购物车列表
router.get('/getCartList', function(req, res, next) {
  let { page, size } = req.query

  page = parseInt(page||1)
  size = parseInt(size||1000)

  jwt.verifyToken(req, res).then((userArr)=>{
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
  }).catch(err=>{
    res.json({err:1,msg:'fail',err})
  })
})

// 改变购物车商品数量
router.post('/updateCartNum', function(req, res, next) {
  let { num, id } = req.body

  if (!num) return res.json({err:-1, msg:'num是必填参数'})
  if (num < 1) return res.json({err:-1, msg:'num不能小于1'})
  if (!id) return res.json({err:-1, msg:'id是必填参数'})

  jwt.verifyToken(req, res).then(()=>{
    cartModel.updateOne({_id: id}, {num}).then(()=>{
      res.json({err:0,msg:'成功'})
    })
  }).catch(err=>{
    res.json({err:1,msg:'fail',err})
  })
})

// 删除购物车商品
router.get('/deleteToCart', function(req, res, next) {
  let { id } = req.query

  if (!id) return res.json({err: -1, msg:'id是必填参数'})

  jwt.verifyToken(req, res).then(()=>{
    cartModel.deleteMany({_id: id}).then(()=>{
      res.json({err:0,msg:'删除成功'})
    })
  }).catch(err=>{
    res.json({err:1,msg:'fail',err})
  })
})

// 提交购物车
router.post('/submitToCart', function(req, res, next) {
  let { goods } = req.body

  // goods是用 ; 连接起来的 _id的字符串，不能用数组进行传递
  if (!goods) return res.json({err: -1, msg: 'goods是必填参数'})

  let goodIdArr = goods.split(';')
  goodIdArr.map((ele,idx)=>{
    if (!ele) goodIdArr.splice(idx,1)
  })

  jwt.verifyToken(req, res).then(()=>{
    let count = 0
    goodIdArr.map(ele=>{
      console.log('ele', ele)

      cartModel.deleteMany({_id: ele}).then(()=>{
        count++
        if (count == goodIdArr.length) {
          res.json({err:0, msg:'下单成功'})
          // 向'订单'集合中插入一条订单记录
        }
      })

      // cartModel.updateOne({_id: ele }, { status: 0 }).then(()=>{
      //   count++
      //   console.log('count', count)
      //   if (count == goodIdArr.length) {
      //     res.json({err:0, msg:'下单成功'})
      //     // 向'订单'集合中插入一条订单记录
      //   }
      // })
    })
  }).catch(err=>{
    console.log('token失败')
    res.json({err:1,msg:'fail',err})
  })
})

module.exports = router;
