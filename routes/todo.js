var express = require('express');
var router = express.Router();
var todoModel = require('../model/todos')


/* 获取我的任务列表（待完成、已完成） */
router.get('/getMyTodos', function(req, res, next) {
  let { userId } = req.query
  if (!userId) {
    res.json({err:1, msg:'学号不能为空！'})
    return
  }
  todoModel.find({userId}).sort({createTime:-1}).then(arr=>{
    var undone = arr.filter(ele=>ele.status=='0')
    var done = arr.filter(ele=>ele.status=='1')
    res.json({err:0, msg:'success', data: {undone, done}})
  }).catch(err=>{
    res.json({err:1, msg: '获取todos列表失败'})
  })
})


/* 新增todo */
router.post('/addTodo', function(req, res, next) {
  let { userId, task } = req.body
  // 校验学号的格式
  var reg = /^(sz|SZ)\d{9}/
  if (!reg.test(userId)) {
    res.json({err:1, msg:'你的学号格式不对！'})
    return
  }
  if (!task) {
    res.json({err:1, msg:'任务名称不能为空！'})
    return
  }
  todoModel.insertMany([{userId, task, status:'0', createTime: Date.now()}]).then(()=>{
    res.json({err:0, msg:'success'})
  }).catch(err=>{
    res.json({err:1, msg: '添加失败'})
  })
})

/* 删除一条todo */
router.get('/deleteTodo', function(req, res, next) {
  let { userId, id } = req.query
  if (!userId || !id) {
    res.json({err:1, msg:'学号或id不能为空！'})
    return
  }
  todoModel.deleteOne({userId, _id: id}).then(()=>{
    res.json({err:0, msg: '删除成功'})
  }).catch(err=>{
    res.json({err:1, msg: '删除失败'})
  })
})

/* 任务状态切换 */
router.get('/changeTodoStatus', function(req, res, next) {
  let { userId, id, status } = req.query
  if (status!='0' && status!='1') {
    res.json({err:1, msg:'status只能是0或1，且为字符串类型！'})
    return
  }
  if (!userId || !id) {
    res.json({err:1, msg:'学号或id不能为空'})
    return
  }
  todoModel.updateOne({userId, _id:id}, {status, createTime:Date.now()}).then(()=>{
    res.json({err:0, msg:'操作成功'})
  }).catch(err=>{
    res.json({err:1, msg: '操作失败'})
  })
})

/* 修改任务名称 */
router.post('/editTodo', function(req, res, next) {
  let { userId, id, task } = req.body
  if (!userId || !id || !task) {
    res.json({err:1, msg:'学号、任务id、任务名称都不能为空！'})
    return
  }
  todoModel.updateOne({userId, _id:id}, {task}).then(()=>{
    res.json({err:0, msg:'修改成功'})
  }).catch(err=>{
    res.json({err:1, msg:'修改失败'})
  })
})

module.exports = router;