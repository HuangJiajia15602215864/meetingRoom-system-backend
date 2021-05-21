// 引入SQL模块
var sql = require('../tool/sql');
// 引入json模块
var json = require('../tool/json');
// 引入连接池
var pool = require('../tool/pool');
var {
    change,
    getLastlyMonth,
    getCurrentDate
} = require('../tool/method');
var {
    buildingList,
    roomSizeList
} = require('../tool/keyValue');

// 统计
var statistics = {
    // 获取面板数据
    pannelData: function (req, res, next) {
        let pannelObj = {}
        pannelObj.meetingDateArr = []
        pannelObj.meetingResultArr = []
        let time = 0
        pool.getConnection(function (err, connection) { // 建筑楼总数
            connection.query(sql.buildingNum, function (err, result) {
                pannelObj.buildingNum = result[0].count
                time++
                if (time == 8) {
                    json(res, err, pannelObj);
                }
                connection.release();
            });
        });
        pool.getConnection(function (err, connection) { // 会议室总数
            connection.query(sql.roomNumInBuilding, function (err, result) {
                pannelObj.roomNum = result[0].count
                time++
                if (time == 8) {
                    json(res, err, pannelObj);
                }
                connection.release();
            });
        });
        pool.getConnection(function (err, connection) { // 热门会议室
            connection.query(sql.popularRoom, function (err, result) {
                pannelObj.firstRoom = result[0].roomName
                pannelObj.secondRoom = result[1].roomName
                pannelObj.thirdRoom = result[2].roomName
                time++
                if (time == 8) {
                    json(res, err, pannelObj);
                }
                connection.release();
            });
        });

        for (let i = 0; i <= 2; i++) { // 不同审批状态会议数量
            pool.getConnection(function (err, connection) {
                connection.query(sql.meetingNumByResult, i, function (err, result) {
                    pannelObj.meetingResultArr.push({
                        name: i,
                        value: result[0].count
                    })
                    time++
                    if (time == 8) {
                        json(res, err, pannelObj);
                    }
                    connection.release();
                });
            });
        }

        for (let i = 0; i <= 1; i++) { // 今明两天会议数量
            pool.getConnection(function (err, connection) {
                connection.query(sql.meetingNumByDate, getCurrentDate(i).date, function (err, result) {
                    pannelObj.meetingDateArr.push({
                        name: i,
                        value: result[0].count
                    })
                    time++
                    if (time == 8) {
                        json(res, err, numArr);
                    }
                    connection.release();
                });
            });
        }
    },
    // 获取各建筑楼会议室数量
    roomNumInBuilding: function (req, res, next) {
        let numArr = []
        let time = 0
        for (let i = 1; i <= 4; i++) {
            let sqlSelect = sql.roomNumInBuilding + ' where building=' + i
            pool.getConnection(function (err, connection) {
                connection.query(sqlSelect, function (err, result) {
                    numArr.push({
                        name: change(i, buildingList, 'id', 'buildingName'),
                        value: result[0].count
                    })
                    time++
                    if (time == 4) {
                        json(res, err, numArr);
                    }
                    connection.release();
                });
            });
        }
    },
    // 获取不同容纳人数的会议室数量(可多选建筑楼)
    roomSize: function (req, res, next) {
        let buildingStr = req.query.buildingcheck // 建筑楼
        let roomNum = 0 // 容纳人数
        let numArr = []
        let time = 0
        for (let i = 1; i <= 3; i++) {
            roomNum = (i == 1) ? 15 : (i == 2) ? 50 : 200
            let sqlSelect = sql.roomNumInBuilding + ' where roomNum = ' + roomNum + ' and building in (' + buildingStr + ')'
            pool.getConnection(function (err, connection) {
                connection.query(sqlSelect, function (err, result) {
                    numArr.push({
                        name: change(i, roomSizeList, 'id', 'name'),
                        value: result[0].count
                    })
                    time++
                    if (time == 3) {
                        json(res, err, numArr);
                    }
                    connection.release();
                });
            });
        }
    },
    // 获取会议数量(近一月、近一周，可多选建筑楼)
    meetingNum: function (req, res, next) {
        let buildingStr = req.query.buildingcheck // 建筑楼
        let count = req.query.meetingChangeType == 1 ? 7 : 30 // 1：周、0：月
        let dateArr = getLastlyMonth(count)
        let numArr = [] // 会议数组
        let time = 0
        for (let i = 0; i < count; i++) {
            let sqlSelect = sql.meetingNum + " and meetingDate = '" + dateArr[i] + "' and room.building in (" + buildingStr + ")"
            pool.getConnection(function (err, connection) {
                connection.query(sqlSelect, function (err, result) {
                    numArr.push({
                        name: i,
                        value: result[0].count
                    })
                    time++
                    if (time == count) {
                        json(res, err, numArr);
                    }
                    connection.release();
                });
            });
        }
    },
}

module.exports = {
    statistics
}