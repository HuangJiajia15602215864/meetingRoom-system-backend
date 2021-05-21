var express = require('express');
var router = express.Router();
var {
  room
} = require('../modules/room');


// 获取会议室列表(可通过roomName或者建筑楼过滤)
router.get('/list', function (req, res, next) {
  room.list(req, res, next);
});
// 新增
router.post('/add', function (req, res, next) {
  room.add(req, res, next);
});
// 更新
router.post('/update', function(req, res, next) {
  room.update(req, res, next);
});
// 删除
router.delete('/delete', function (req, res, next) {
  room.delete(req, res, next);
});
// 会议室预订时查询（通过条件查询可用会议室）
router.get('/selectByCondition', function (req, res, next) {
  room.selectByCondition(req, res, next);
});


module.exports = router;
