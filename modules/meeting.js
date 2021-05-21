// 引入SQL模块
var sql = require('../tool/sql');
// 引入json模块
var json = require('../tool/json');
// 引入连接池
var pool = require('../tool/pool');
var {getCurrentDate} = require('../tool/method');

// 会议
var meeting = {
    // 获取预订列表(可通过会议日期或者建筑楼过滤)
    list: function (req, res, next) {
        let sqlSelect = sql.meetingSelect
        if (req.query.date) {
            sqlSelect += " and meetingDate = '" + req.query.date + "'"
        }
        if (req.query.building) {
            sqlSelect += " and building = " + req.query.building
        }  
        if (req.query.status) {
            sqlSelect += " and approveResult = " + req.query.status
        }       
        let index = (req.query.page - 1) * req.query.pageSize // 分页查询索引
        let userSelect = sqlSelect +" order by id desc" + " limit " + index + ',' + req.query.pageSize
        let count = 0 // 总数
        pool.getConnection(function (err, connection) {
            connection.query(sqlSelect, function (err, result) { // 获取总条数
                count = result.length
                connection.release();
                pool.getConnection(function (err, connection) {
                    connection.query(userSelect, function (err, result) { // 分页查询
                        let obj = {
                            list: result,
                            count: count
                        }
                        json(res, err, obj);
                        connection.release();
                    });
                });
            });
        });
    },
    // 通过id获取预订详情
    query: function (req, res, next) {
        let sqlSelect = sql.meetingSelect
        sqlSelect += " and meeting.id = " + req.query.id
        pool.getConnection(function (err, connection) {
            connection.query(sqlSelect, function (err, result) { // 分页查询
                json(res, err, result[0]);
                connection.release();
            });
        });
    },
    // 通过token获取用户本人预订记录（筛选会议是否开始）
    record: function (req, res, next) {
        let sqlSelect = sql.meetingRecord + ' AND meeting.bookPersonId = ' + req.decoded.id

        let date = getCurrentDate(0).date
        let time = getCurrentDate(0).time
        if(req.query.statusId === '1'){// 未开始（当前时间<会议开始时间）
            sqlSelect += " AND UNIX_TIMESTAMP(CONCAT('"+ date +"',"+ "' " + time + "')) < UNIX_TIMESTAMP(CONCAT(meeting.meetingDate,"+"' '"+',meeting.startTime))'
        }else if(req.query.statusId === '2'){// 正在进行（当前时间>=会议开始时间 && 当前时间<=会议结束时间）
            sqlSelect += " AND UNIX_TIMESTAMP(CONCAT('"+ date +"',"+ "' " + time + "')) >= UNIX_TIMESTAMP(CONCAT(meeting.meetingDate,"+"' '"+',meeting.startTime))' + " AND UNIX_TIMESTAMP(CONCAT('"+ date +"',"+ "' " + time + "')) <= UNIX_TIMESTAMP(CONCAT(meeting.meetingDate,"+"' '"+',meeting.endTime))'      
        }else{// 已结束（当前时间>会议结束时间）
            sqlSelect += " AND UNIX_TIMESTAMP(CONCAT('"+ date +"',"+ "' " + time + "')) > UNIX_TIMESTAMP(CONCAT(meeting.meetingDate,"+"' '"+',meeting.endTime))'
        }
       
        let index = (req.query.page - 1) * req.query.pageSize // 分页查询索引
        let userSelect = sqlSelect +" order by id desc" + " limit " + index + ',' + req.query.pageSize
        let count = 0 // 总数
        pool.getConnection(function (err, connection) {
            connection.query(sqlSelect, function (err, result) { // 获取总条数
                count = result.length
                connection.release();
                pool.getConnection(function (err, connection) {
                    connection.query(userSelect, function (err, result) { // 分页查询
                        let obj = {
                            list: result,
                            count: count
                        }
                        json(res, err, obj);
                        connection.release();
                    });
                });
            });
        });
    },
    // 会议预订
    book: function (req, res, next) {
        var p = req.body;
        pool.getConnection(function (err, connection) {
            connection.query(sql.meetingBook,[req.decoded.id,p.roomId,p.num,p.meetingTheme,p.date,p.startTime,p.endTime,0], function (err, result) { // 分页查询
                json(res, err, null);
                connection.release();
            });
        });   
    },
    // 审批预订
    approve: function (req, res, next) {
        var p = req.body;
        pool.getConnection(function (err, connection) {
            connection.query(sql.meetingApprove,[p.approveResult,p.rejectReason,req.decoded.id,p.id], function (err, result) { // 分页查询
                json(res, err, null);
                connection.release();
            });
        });   
    }
}

module.exports = {
    meeting
}