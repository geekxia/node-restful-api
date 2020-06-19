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
function verifyToken(req, res) {
  // 解密token
  // 注意大小写 authorization
  let token = req.headers.authorization
  // console.log('token', token)
  try {
    let info = jwt.verify(token, 'geekxia').data
    return userModel.find(info)
  } catch(err) {
    return res.status(400).json({err:2,msg:'token无效，请重新登录'})
  }
}

module.exports = { generateToken, verifyToken }
