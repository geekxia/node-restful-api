let mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/geek', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

var db = mongoose.connection
db.on('error', err=>{
  console.log('数据连接失败')
})
db.on('open', ()=>{
  console.log('数据连接成功')
})
