var jwt = require('jsonwebtoken')

// jwt 是目前互联网领域最常用的一种用户鉴权方式

// 生成token
function createToken(data) {
  return jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7), // 单位是秒
    data,   // 就是我要在token加密的信息
  }, 'qf')
}

// 验证token
function verifyToken(req, res) {
  return new Promise(function(resolve, reject) {
    try {
      var token = req.headers.authorization
      if(!token) {
        return res.json({err: -1, msg: 'token 无效'})
      } else {
        var decoded = jwt.verify(token, 'qf')
        resolve(decoded.data)
      }
    } catch(err) {
      reject(err)
    }
  })
}

module.exports = {
  createToken,
  verifyToken
}
