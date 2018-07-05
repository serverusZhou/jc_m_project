import { VIDEO_URL, IMAGE_URL } from './config';
// const { location } = window;

/**
 * @name isArray 判断是否是数组，和判断是否是非空数组
 * @param {any} arr 
 * @param {boolean} isNeedEmpty 是否需要判段非空数组，default false 
 * @returns boolean
 */
export const isArray = (arr, isNeedEmpty = false) => {
    if (!isNeedEmpty) {
        return arr instanceof Array
    }
    return arr instanceof Array && arr.length > 0;
}

/**
 * @name interfaceFormatHandle 接口数据格式转化
 * @param {any} data 需要转换的数据
 * @returns 后台接口要的格式，
 */
export const interfaceFormatHandle = (data) => {
    return data;
}
/**
 * @name getUrlParam 获取url某个参数的值
 * @param {string} url 要查找的Url
 * @param {string} key 要查找的key
 * @returns 根据key找的value
 */
export const getUrlParam = (key) => {
    let href = window.location.href;
    /* 如果压根没这个字段就不需要正则啦 */
    if (href.indexOf(key) === -1) {
        return ''
    }
    var pattern = new RegExp('[?&]' + key + '=([^&]*)', 'g');
    href.match(pattern)
    return RegExp.$1
}

/* 搬过来的,暂时没看懂, #汗# */
export const getQuery = (name, url) => {
    let reg, ret, query
    let search = ''
    if (!url) {
        search = window.location.search.substr(1)
    } else {
        search = url.substr(1)
    }
    if (name) {
        reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
        query = search.match(reg)
        return query !== null ? decodeURIComponent(query[2]) : null
    }
    reg = new RegExp(/(^|&)(\w+)=([\w]*)/, 'g');
    query = search.match(reg)
    ret = {}
    query.forEach(v => {
        let arr = v.split('=')
        if (arr[0].indexOf('&') > -1) arr[0] = arr[0].slice(1)
        ret[arr[0]] = decodeURIComponent(arr[1])
    })
    return ret
}

/* 搬过来的,暂时没看懂, #汗# */
export const wxShare = function (name, intro, image) {
    var oReq = new XMLHttpRequest()

    oReq.onload = (e) => {
        if (oReq.status !== 200) return
        var data = oReq.response
        if (data) {
            /* global wx:true */
            data = JSON.parse(data)
            wx.config({
                // debug: true,
                appId: 'wxc89ca66545c2df54',
                timestamp: data.timestamp,
                nonceStr: data.nonceStr,
                signature: data.signature,
                jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
            })
            // let url = window.location.href
        }

        wx.ready(() => {
            wx.onMenuShareAppMessage({
                title: name,
                desc: intro.substring(0, 30),
                imgUrl: image,
                // link: url
            })
            wx.onMenuShareTimeline({
                title: name,
                imgUrl: image,
                // link: url
            })
            wx.onMenuShareQQ({
                title: name,
                desc: intro.substring(0, 30),
                imgUrl: image,
            })
        })
    }
    oReq.open('POST', '/wechat/get_params')
    oReq.send()
}

/**
 * @desc 转换param 类似jq 的parseParam 方法
 * @param {object} param 转成的对象
 * @returns aa=11&bb=22 这样的urlparam
 */
export const paramParse = (param = null) => {
    if (!param || typeof (param) !== 'object') {
        return '';
    }
    let paramArr = [];
    for (const [key, value] of Object.entries(param)) {
        paramArr.push(`${key}=${value}`);
    }

    return (paramArr.length ? '?' : '') + paramArr.join('&');
}


/**
 * @desc 计算星座
 * @param {<yyyy-mm-dd>} birthday 月
 * @returns yy后 xx座
 */
export const getAstro = (birthday) => {
    if (!birthday) {
        return '';
    }
    let birthdayArr = birthday.split('-');

    if (!birthdayArr instanceof Array && birthdayArr.length < 3) {
        return '';
    }
    let year = birthdayArr[0] + '';
    let month = birthdayArr[1];
    let day = birthdayArr[2];

    let y = Math.floor((year.substr(year.length - 2, 2) / 5)) * 5;
    y = (y < 10 ? '0' : '') + y;
    let s = '魔羯水瓶双鱼牡羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯';
    let arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
    return y + '后 ' + s.substr(month * 2 - (day < arr[month - 1] ? 2 : 0), 2) + '座';
};



/**
 * @desc 数字装换成双数
 * @param {number} num 要转换的数字
 * @returns {string} 把1 => 01 ,5 => 05,12 =>12 default:'00'
 */
export const addZero = (num) => {
    if (!num) return '00';
    if (!typeof (num) === 'number') {
        num = parseInt(num, 10);
    }
    if (typeof (num) === 'number') {
        return num < 10 ? ('0' + num) : '' + num;
    } else {
        return '00';
    }
}

/**
 * @desc 转换秒 3666 => 01:06:60
 * @param second
 * @param {number} seconds 要转换的秒
 * @param {string} decimal = 'hh:mm:ss' 要保留几位小数，默认1
 * @returns {string || number} hh:mm:sss 格式的
 */
export const transformSecondToTime = (second) => {
    let ss = addZero(second % 60);
    let mm = addZero(parseInt(second / 60, 10) % 60);
    let hh = addZero(parseInt(second / 360, 10) % 360);

    return hh + ':' + mm + ':' + ss;
}

/**
 * @desc 处理单位  例如下列
    1 0<=数量<10000：直接显示具体数字，如9878显示为”9878“
    2、数量>=10000：保留1位小数，以w为单位，四舍五入，如28900显示为“2.9w"
    @props
 * @param {<{level,unit}>[]} standardUnit 单位标准
 * @param {number} data 要加单位的数字
 * @param {number} decimal 要保留几位小数，默认1
 * @returns {string || number} 带单位的数字
 * @example getUnit([{level:10,unit:'十'}],88) //8.8十
 */
export function getUnit(standardUnit = [], data, decimal = 1) {
    if (standardUnit instanceof Array && typeof (data) === 'number') {
        /* 倒叙，为啥倒叙，你难道不想思考一下么？答案在下面 */
        for (let i = standardUnit.length - 1; i >= 0; i--) {
            const item = standardUnit[i];
            if (item.level && item.unit) {
                /* 倒叙好处就是不用在判断要小于前一个，因为如果大于前一个，已经在之前就return 了 */
                if (data >= item.level) {
                    return (data / (item.level === 0 ? 1 : item.level)).toFixed(decimal) + item.unit;
                }
            }
        }
    }
    return data;
}

/**
 * @desc 处理videourl
 * @param second
 * @param {number} seconds 要转换的秒
 * @param {string} decimal = 'hh:mm:ss' 要保留几位小数，默认1
 * @returns {string || number} hh:mm:sss 格式的
 */
export const handleVideoUrl = (url) => {
    if (!url) return '';
    if (url.includes('http') || url.includes('https')) {
        return url;
    }
    return VIDEO_URL + url;
}

/**
 * @desc 处理Img
 * @param url
 * @param {number} preffix 要转换的秒
 * @param {string} suffix = 'hh:mm:ss' 要保留几位小数，默认1
 * @returns {string || number} hh:mm:sss 格式的
 */
export const handleImgUrl = (url, preffix = IMAGE_URL, suffix) => {
    if (url === '' || url === null || url === undefined || url.indexOf('http') === 0 || url.indexOf('https') === 0) {
        return url;
    }
    if (!suffix) suffix = '';
    return preffix + url + suffix;
}

/**
 * @desc 将对象去除一些属性 omit  omit({a:1,b:2,c:3},['a','c']) //{b:2}
 * @param url
 * @param {number} preffix 要转换的秒
 * @param {string} suffix = 'hh:mm:ss' 要保留几位小数，默认1
 * @returns {string || number} hh:mm:sss 格式的
 */
export const omit = (obj = {}, props, fn) => {
    // if (!isObject(obj)) return {};
    if (!obj || typeof (obj) !== 'object') return {};

    if (typeof props === 'function') {
        fn = props;
        props = [];
    }

    if (typeof props === 'string') {
        props = [props];
    }

    var isFunction = typeof fn === 'function';
    var keys = Object.keys(obj);
    var res = {};

    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var val = obj[key];

        if (!props || (props.indexOf(key) === -1 && (!isFunction || fn(val, key, obj)))) {
            res[key] = val;
        }
    }
    return res;
};


const isObject = (obj) => {
    if (obj === null || obj instanceof Array) {
        return false;
    }
    return typeof (obj) === 'object'
}

/**
 * 
 * deepEuqal 深比较
 * @param {any} obj1 比较的第一个函数
 * @param {any} obj2 比较的第二个对象
 * @returns 
 */
export const deepEuqal = (obj1, obj2, callback = () => { }) => {
    if (isObject(obj1) && isObject(obj2)) {
        for (let keys of Object.keys(obj1)) {
            if ((isObject(obj1[keys]) && isObject(obj2[keys])) || (isArray(obj1[keys]) && isArray(obj2[keys]))) {
                if (!deepEuqal(obj1[keys], obj2[keys])) {
                    return false;
                }
            } else {
                if (obj1[keys] !== obj2[keys]) {
                    return false;
                }
            }
        }
        return true;
    } else if (isArray(obj1) && isArray(obj2)) {
        /* 如果obj的length 不一致，还比个屁啊 */
        if (obj1.length !== obj2.length) {
            return false;
        }

        for (let keys = 0; keys < obj1.length; keys++) {
            if ((isObject(obj1[keys]) && isObject(obj2[keys])) || (isArray(obj1[keys]) && isArray(obj2[keys]))) {
                if (!deepEuqal(obj1[keys], obj2[keys])) {
                    return false;
                }
            } else {
                if (obj1[keys] !== obj2[keys]) {
                    return false;
                }
            }


        }
        return true;
    } else {
        return obj1 === obj2
    }
}