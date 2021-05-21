var express = require('express');
var router = express.Router();
var {
  statistics
} = require('../modules/statistics');

// 获取面板数据
router.get('/pannelData', function (req, res, next) {
  statistics.pannelData(req, res, next);
});
// 获取各建筑楼会议室数量
router.get('/roomNumInBuilding', function (req, res, next) {
  statistics.roomNumInBuilding(req, res, next);
});
// 获取不同容纳人数的会议室数量(可多选建筑楼)
router.get('/roomSize', function (req, res, next) {
  statistics.roomSize(req, res, next);
});
// 获取会议数量(近一月、近一周，可多选建筑楼)
router.get('/meetingNum', function (req, res, next) {
  statistics.meetingNum(req, res, next);
});

module.exports = router;
