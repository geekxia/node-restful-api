const jwt = require('jsonwebtoken')
var userModel = require('../db/userModel')

// 使用 HMAC SHA256 加密方式生成token
function generateToken(data) {
  // 对data进行加密
  let token = jwt.sign({
    data,
    exp: Math.floor(Date.now()/1000) + 60*60*24*30,  // 有效期30天，单位是秒
    iat: Date.now()
  }, 'geekxia')
  return token
}

// 解密并验证token
function verifyToken(req) {
  // 解密token
  // 注意大小写 authorization
  let token = req.headers.authorization
  // console.log('token', token)
  var info = jwt.verify(token, 'geekxia').data
  // 查询数据库是否有当前用户
  // 返回promise
  return userModel.find(info)
}

module.exports = { generateToken, verifyToken }
