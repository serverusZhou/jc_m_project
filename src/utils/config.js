
// let base_url = 'http://test.dxapi.youxiang0210.com';

let base_url = 'http://realtest.youxiang0210.com';

if (process.env.MY_NODE_ENV === 'production') {
    /* 正式环境 */
    // base_url = 'http://dxapi.youxiang0210.com'; // 正式环境
    base_url = 'http://daxiangapi.youxiang0210.com'; // 正式临时环境
}
if (process.env.MY_NODE_ENV === 'development') {
    /* 开发环境 */
    base_url = 'http://test.dxapi.youxiang0210.com';
}
if (process.env.MY_NODE_ENV === 'test') {
    /* 测试环境 */
    base_url = 'http://realtest.youxiang0210.com';
}

export const BASE_URL = base_url;
export const IMAGE_URL = 'http://image.youxiang0210.com/';
export const VIDEO_URL = 'http://video.youxiang0210.com/';
export const TO_APP_URL = 'jcgroup://youxiang.com/go';
export const DEFAULT_SHARE = 'https://image.youxiang0210.com/wechat-share.png';