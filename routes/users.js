var express = require('express');
var router = express.Router();
var userModel = require('../db/userModel')

/* 注册 */
router.post('/regist', function(req, res, next) {
  let { username, password, password2 } = req.body
  if(!username || !password || !password2) {
    res.json({err: 1, msg: '注册信息不能为空'})
  }
  if (password !== password2) {
    res.json({err: 1, msg:'两次密码输入不一致'})
  }
  // 第1步：先判断用户名是否已被注册
  userModel.find({username}).then(arr=>{
    if(arr.length > 0) {
      res.json({err: 1, msg: '该用户名已被注册'})
    } else {
      // 第2步：注册
      userModel.insertMany([{username, password}]).then(()=>{
        res.json({err: 0, msg: 'success'});
      }).catch(error=>{
        res.json({err: 1, msg: 'fail'})
      })
    }
  })
})

/* 登录 */
router.post('/login', function(req, res, next) {
  let { username, password } = req.body
  userModel.find({username,password}).then(arr=>{
    if (arr.length > 0) {
      res.json({err:0, msg:'登录成功'})
    } else {
      res.json({err:1, msg: '登录失败'})
    }
  })
})

module.exports = router;
