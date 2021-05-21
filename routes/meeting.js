var express = require('express');
var router = express.Router();
var {
  meeting
} = require('../modules/meeting');


// 获取预订列表(可通过会议日期或者建筑楼过滤)
router.get('/list', function (req, res, next) {
  meeting.list(req, res, next);
});
// 通过id获取预订详情
router.get('/query', function (req, res, next) {
  meeting.query(req, res, next);
});
// 通过token获取用户本人预订记录（筛选会议是否开始）
router.get('/record', function (req, res, next) {
  meeting.record(req, res, next);
});

// 会议预订
router.post('/book', function (req, res, next) {
  meeting.book(req, res, next);
});
// 审批预订
router.post('/approve', function (req, res, next) {
  meeting.approve(req, res, next);
});

module.exports = router;
