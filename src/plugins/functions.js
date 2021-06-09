export default {
    // eslint-disable-next-line no-unused-vars
    install(Vue, options) {
        Vue.prototype.$formatCount = function (val) {
            let nVal = ['', '', ''];
            let fr = 1000;
            let num = 3;
            while (val / fr >= 1) {
                fr *= 10;
                num += 1;
            }
            if (num <= 4) { // 千
                nVal[1] = '千';
                nVal[0] = parseInt(val / 1000) + '';
            } else if (num <= 8) { // 万
                const str = parseInt(num - 4) / 3 > 1 ? '千万' : '万';
                const fm = '万' === str ? 10000 : 10000000;
                nVal[1] = str;
                nVal[0] = parseInt((val / fm)) + '';
            } else if (num <= 16) {// 亿
                let str = (num - 8) / 3 > 1 ? '千亿' : '亿';
                str = (num - 8) / 4 > 1 ? '万亿' : str;
                str = (num - 8) / 7 > 1 ? '千万亿' : str;
                let fm = 1;
                if ('亿' === str) {
                    fm = 100000000;
                } else if ('千亿' === str) {
                    fm = 100000000000;
                } else if ('万亿' === str) {
                    fm = 1000000000000;
                } else if ('千万亿' === str) {
                    fm = 1000000000000000;
                }
                nVal[1] = str;
                nVal[0] = parseInt(val / fm) + '';
            }
            if (val < 1000) {
                nVal[1] = '';
                nVal[0] = parseInt(val) + '';
            }
            return nVal.join('');
        };
        Vue.prototype.$formatStr = function (val) {

            if (!val) {
                return "这个人很懒，什么都没有写。";
            } else if (val.length > 15) {
                return val.substr(0, 15) + "...";
            } else {
                return val;
            }
        },
            Vue.prototype.$formatTime = function (timespan) {
                var dateTime = new Date(timespan) // 将传进来的字符串或者毫秒转为标准时间
                var year = dateTime.getFullYear()
                var month = dateTime.getMonth() + 1
                var day = dateTime.getDate()
                var hour = dateTime.getHours()
                var minute = dateTime.getMinutes()
                // var second = dateTime.getSeconds()
                var millisecond = dateTime.getTime() // 将当前编辑的时间转换为毫秒
                var now = new Date() // 获取本机当前的时间
                var nowNew = now.getTime() // 将本机的时间转换为毫秒
                var milliseconds = 0
                var timeSpanStr
                milliseconds = nowNew - millisecond
                if (milliseconds <= 1000 * 60 * 1) { // 小于一分钟展示为刚刚
                    timeSpanStr = '刚刚'
                } else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) { // 大于一分钟小于一小时展示为分钟
                    timeSpanStr = Math.round((milliseconds / (1000 * 60))) + '分钟前'
                } else if (1000 * 60 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24) { // 大于一小时小于一天展示为小时
                    timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前'
                } else if (1000 * 60 * 60 * 24 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 15) { // 大于一天小于十五天展示位天
                    timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天前'
                } else if (milliseconds > 1000 * 60 * 60 * 24 * 15 && year === now.getFullYear()) {
                    timeSpanStr = month + '-' + day + ' ' + hour + ':' + minute
                } else {
                    timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute
                }
                return timeSpanStr
            }
    }
}