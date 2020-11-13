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
    create_time: Date.now()
  }
  adModel.insertMany([ad]).then(()=>{
    res.json({err: 0, msg: 'success'})
  })
})

// 获取轮播图列表
router.get('/list', function(req, res) {
  adModel.find({}).then(list=>{
    res.json({err: 0, msg: 'success', data: {list}})
  })
})

module.exports = router;
