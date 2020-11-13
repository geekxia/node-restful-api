var express = require('express');
var router = express.Router();
var jwt = require('../utils/jwt')

// 导入users这个集合的model
var userModel = require('../model/users')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
})

// 获取所有用户列表
router.get('/getList', function(req, res) {
  // res.send('user list')
  userModel.find({}).then(arr=>{
    console.log('arr', arr)
    res.json({
      err:0,
      msg:'success',
      data: {
        list: arr,
        total: arr.length
      }
    })
  })
})

// 注册
router.post('/regist', function(req, res) {
  // 第1步：接受入参
  var { username, password, password2 } = req.body  // 解构赋值
  // 第2步：验证入参
  // 当接收到前端的入参后，后端要检测数据是否符合要求
  if(!/^[a-zA-Z][a-zA-Z0-9]{2,11}$/.test(username)) {
    return res.json({err: 1, msg: '用户名要求以字母开关，由数字和字母组合，6-12位'})
  }
  if(!/^[a-zA-Z0-9\@\-\#\.\*\~\^]{6,18}$/.test(password)) {
    return res.json({err: 1, msg: '密码不安全'})
  }
  if(!username) {
    return res.json({err: 1, msg: '用户名不能为空'})
  }
  if(!password) {
    return res.json({err: 1, msg: '密码不能为空'})
  }
  if(!(password===password2)) {
    return res.json({err: 1, msg: '两次密码不相同'})
  }
  // 验证用户名是否已经被注册和占用
  userModel.find({username}).then(arr=>{
    if(arr.length>0) {
      return res.json({err: 1, msg:'当前用户名已被占用'})
    } else {
      // 第3步：入库
      var user = {
        username,
        password,
        create_time: Date.now()
      }
      userModel.insertMany([user]).then(()=>{
        // 第4步：入库成功，响应前端
        res.json({err: 0, msg: '注册成功'})
      })
    }
  })
})

// 登录
router.post('/login', function(req, res) {
  console.log('---------')
  var { username, password } = req.body
  if(!username) {
    return res.json({err: 1, msg: '用户名不能为空'})
  }
  if(!password) {
    return res.json({err: 1, msg: '密码不能为空'})
  }
  userModel.find({username, password}).then(arr=>{
    if(arr.length===1) {
      // 根据用户信息生成token
      res.json({err:0,msg:'success',data: {token: jwt.createToken({username,password})}})
    } else {
      res.json({err: 1, msg: '用户名和密码不匹配'})
    }
  })
})

module.exports = router;
