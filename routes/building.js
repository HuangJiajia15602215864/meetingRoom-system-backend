var express = require('express');
var router = express.Router();
var {
    building
} = require('../modules/building');

// 获取建筑楼列表
router.get('/list', function (req, res, next) {
    building.list(req, res, next);
});

module.exports = router;