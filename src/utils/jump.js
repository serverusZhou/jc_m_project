// import { downloadPageUrl, paramParse } from './toolFunc.js';
import { paramParse } from 'utils/toolFunc.js';
import { TO_APP_URL } from 'utils/config.js';
import { history } from 'utils/history.js';

/**
 * @name isOriginalBrowser 是原生浏览器（不是微信，微博等内置浏览器
 * @return {boolean} 
 */
const isOriginalBrowser = () => {
    const ua = navigator.userAgent;
    return !(/MicroMessenger/i.test(ua) || /WeiBo/i.test(ua))
}

/**
 * @name isIOS 是苹果么?
 * @return {boolean} 
 */
const isIOS = () => {
    const ua = navigator.userAgent;
    return /iPhone/i.test(ua)
};

/**
 * @name openAppAndToDownloadPage
 * @param {string} appurl 跳转到app 的url( 百度关键词:schemeUrl )
 * @param {function} unsuccessfulCallback 跳转不成功的回调
 * @todo 1 打开appurl 2.打开之后,m站跳转到download页
 */
const openAppAndToDownloadPage = ({ appUrl = TO_APP_URL, searchParam, unsuccessfulCallback }) => {
    alert(`openAppAndToDownloadPage=' '+${appUrl}${searchParam}`);
    /* 跳转到app */
    window.location.href = `${appUrl}${searchParam}`;

    /* 如果没有un  unsuccessfulCallback 给他一个默认值*/
    const delay = 3000;
    const now = Date.now();
    unsuccessfulCallback = typeof (unsuccessfulCallback) !== 'function' ? () => {
        /* 为了避免safari 中弹出哪个对话框.这样是不阻止 js 运行的. */
        if (Date.now() - now < delay + 10) {
            /* if 不是ios else是 ios 去苹果商店 */
            history.push(
                {
                    pathname: `/download`,
                }
            );
        }
    } : unsuccessfulCallback;
    setTimeout(unsuccessfulCallback, delay);
};

export const jumpApp = {
    /* 打开 提示在浏览器页面打开 的这个页面 */
    openBrowserToAppOrDownload: (param) => {
        /* 是否是微信 或者 微博*/
        if (!isOriginalBrowser()) {
            // location.href = `${location.origin}/browserOpen${paramParse(param)}`;
            alert('paramParse(param) = ' + paramParse(param));
            history.push(
                {
                    // pathname: `/browserOpen${paramParse(param)}`,
                    pathname: `/browserOpen`,
                    search: paramParse(param),
                    state: {
                        ...param
                    },
                }
            );
        } else {
            openAppAndToDownloadPage({ searchParam: paramParse(param) });
        }
    },
    openAppAndToDownloadPage,
    isIOS,
    isOriginalBrowser,
};

export const gotoNotFound = () => {
    history.push(`/notFound`);
}