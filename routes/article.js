var express = require('express');
var router = express.Router();
var articleModel = require('../db/articleModel')

/* 文章新增 */
router.post('/create', function(req, res, next) {

  

  let { username, title, content } = req.body

  let ele = {
    username: 'geekxia',
    title,
    content,
    createTime: Date.now()
  }

  articleModel.insertMany([ele]).then(()=>{
    res.json({err:0, msg:'succuss', data: {title}})
  })

  res.json({err:0, msg: 'create'})
});

module.exports = router;
