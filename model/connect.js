var mongoose = require('mongoose')

// 连接数据库
mongoose.connect('mongodb://localhost/qf2006', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})

// 获取数据库连接对象
var connection = mongoose.connection

connection.on('open', function() {
  console.log('数据库连接成功')
})

connection.on('error', function() {
  console.log('数据库连接失败')
})
