var express = require('express');
var router = express.Router();
var articleModel = require('../db/articleModel')

/* 文章新增 */
router.post('/create', function(req, res, next) {

  res.json({err:0, msg: 'create'})
});

module.exports = router;
