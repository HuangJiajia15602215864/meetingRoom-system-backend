// 公共函数

/**
 * ID转对应的值
 * @param {String} id 标识字段
 * @param {String} field 结果字段
 * @param {String} val 值
 * @param {Array} arr 数组
 */
const change = function (val, arr, id = 'id', field = 'name') {
    const len = arr.length
    for (let i = 0; i < len; i++) {
        if (arr[i][id] == val) {
            return arr[i][field]
        }
    }
}

// 获取当前时间 YY-MM-DD HH:MM
const getCurrentDate = function(addDate) {
    let date = new Date();
    let seperator = "-";

    let currentDate = date.getFullYear() + seperator + addZero(date.getMonth() + 1) + seperator + addZero(date.getDate()+addDate);
    let currentTime = date.getHours() + ':' + addZero(date.getMinutes())
    return {
        date:currentDate,
        time:currentTime
    };
  }

// 获取相对今天的时间
const getDate = function(time, AddDayCount) {
    let date = new Date(time);
    date.setDate(date.getDate() + AddDayCount); //获取AddDayCount天后的日期
    let seperator1 = "-";
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    let currentDate = year + seperator1 + month + seperator1 + strDate;
    return currentDate;
  }

// 获取近一周、月
const getLastlyMonth = function (num) {
    var date = new Date()
    date.setDate(date.getDate() - num) // 获取一个月前的时间戳
    var monthArr = []
    for (let i = 0; i < num; i++) {
        monthArr.push(getDate(date, i))
    }
    return monthArr
}

// 不足10补0
const addZero = function(val){
    return val < 10 ? '0' + val : val
}


module.exports = {
    change,
    getLastlyMonth,
    getCurrentDate
}