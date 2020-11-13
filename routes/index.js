var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  // 接收前端传过来的入参
  // 查询数据库，得到数据 arr
  var arr = [{id:1, name:'lisi'}, {id:2, name:'wangwu'}]

  res.render('index', { title: 'Express', arr: arr });
});

module.exports = router;
