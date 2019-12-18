var express = require('express');
var router = express.Router();
var multiparty = require('multiparty')
var fs = require('fs')
var path = require('path')

/* 图片上传 */
router.post('/img', function(req, res, next) {
  var form = new multiparty.Form()
  form.parse(req, function(err,fields,files) {
    if(err) {
      res.json({err: 1, msg: '图片上传失败'})
    } else {
      var file = files.imgs[0]
      console.log('file', file)
      // 图片不能为空
      if(file.originalFilename) {
        var read = fs.createReadStream(file.path)
        var write = fs.createWriteStream(path.join(__dirname, '../public/upload/'+file.originalFilename))
        read.pipe(write)
        write.on('close', function() {
          console.log('图片上传 成功')
          res.redirect('/upload/'+file.originalFilename)
          // xhEditor图片上传成功后的写法
          // res.json({err:0, msg: '/upload/'+file.originalFilename})
        })
      } else {
        res.json({err:1, msg: '图片不能为空'})
      }
    }
  })
})

module.exports = router;
