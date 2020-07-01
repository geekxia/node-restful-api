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
  let token = req.headers.authorization
  return new Promise(function(resolve, reject) {
    try {
      let decoded = jwt.verify(token, 'geekxia')
      resolve(decoded.data)
    } catch(err) {
      reject({err:-1,msg:'token invalid'})
    }
  })
}

module.exports = { generateToken, verifyToken }
