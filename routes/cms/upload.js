var express = require('express');
var router = express.Router();
var multiparty = require('multiparty')
var fs = require('fs')


/* 图片上传 */
router.post('/img', function(req, res) {

	var form = new multiparty.Form()

	form.parse(req, function(err, fields, files) {
		if (err) {
			res.json({err: 1, msg: 'img fail'})
		} else {
			var img = files.file[0]
			console.log('img', img)
			var read = fs.createReadStream(img.path)

			var writePath = `/upload/${Date.now()}.${img.originalFilename}`
			var write = fs.createWriteStream('./public/'+writePath)
			read.pipe(write)
			// 当管道流关闭时，把图片在服务上的访问地址返回给客户端
			write.on('close', function(){
				res.json({err:0,msg:'success', data: {url: writePath}})
			})
		}
	})

  
});

module.exports = router;



// 图片上传
// action 保证图片上传地址是正确的
// name 指定后端使用哪个key来接收
