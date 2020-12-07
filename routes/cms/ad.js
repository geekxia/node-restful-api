var express = require('express');
var router = express.Router();
var adModel = require('../../model/ads')

// 添加轮播图广告
router.post('/add', function(req, res) {
  let { img, title, desc } = req.body
  
  let ad = {
    img,
    title,
    desc,
    status: 1,
    create_time: Date.now()
  }
  adModel.insertMany([ad]).then(()=>{
    res.json({err: 0, msg: 'success'})
  })
})

// 删除
router.get('/del', function(req, res){
  let { id } = req.query
  adModel.updateOne({_id: id}, {$set: {status: 0}}).then(()=>{
    res.json({err:0, msg: '删除成功'})
  })
})


// 获取轮播图列表
router.get('/list', function(req, res) {
  // status=1 表示“未被删除”的广告
  adModel.find({status: 1}).then(list=>{
    res.json({err: 0, msg: 'success', data: {list}})
  })
})

module.exports = router;
