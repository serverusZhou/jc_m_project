/* ------------------------------ 主页------------------------------  */
import homeMoreUrl from '../assets/indexChannel/homeMore.png'; //查看更多
import homeChangeUrl from '../assets/indexChannel/homeChange.png';//换一批
import loadErrorImgUrl from '../assets/common/no-movie.svg';
import homePlayImgUrl from '../assets/indexChannel/homePlay.png'
import signUnique from '../assets/common/sign-unique.svg';//按钮
import signHomemade from '../assets/common/sign-homemade.svg';//按钮
/* ------------------------------ 主页------------------------------  */

/* ------------------------------ 播放源------------------------------  */
import youxiangImgUrl from '../assets/platform/youxiang.png';
import noMovieImgUrl from '../assets/search/noMovie.svg';
import playImgUrl from '../assets//search/play.svg';
import leshiImgUrl from '../assets/platform/leshi.svg';
import tencentImgUrl from '../assets/platform/tencent.png';
import qiyImgUrl from '../assets/platform/qiy.svg';
import youkuImgUrl from '../assets/platform/youku.png';
import souhuImgUrl from '../assets/platform/souhu.png';
import acfunImgUrl from '../assets/platform/acfun.png';
import sinaImgUrl from '../assets/platform/sina.png';
import tudouImgUrl from '../assets/platform/tudou.png';
import bilibiliImgUrl from '../assets/platform/bilibili.png';
import mgtvImgUrl from '../assets/platform/mgtv.png';
import pptvImgUrl from '../assets/platform/pptv.png';
import huashuImgUrl from '../assets/platform/huashu.png';
import othersImgUrl from '../assets/platform/others.png';
/* ------------------------------ 播放源------------------------------  */

/* ------------------------------ 公用的------------------------------  */
import toTopImgUrl from '../assets/to-top/to-top.svg';
import logoImgSrc from '../assets/common/top-logo.png';
import searchIconSrc from '../assets/common/search.svg';//搜索 （放大镜）
import clearIconSrc from '../assets/search/clear.svg';//输入框清空 （小叉号） 
import defaultUserInfoAvatarImgUrl from '../assets/common/avatar.png'; //默认头像
/* ------------------------------ 公用的------------------------------  */

/* ------------------------------ 下载页------------------------------  */
import phoneImgUrl from '../assets/download/phone.png';
import rotateImgUrl from '../assets/download/rotate.png';
import swiperImg1 from '../assets/download/1.jpg';
import swiperImg2 from '../assets/download/2.jpg';
import swiperImg3 from '../assets/download/3.jpg';
import swiperImg4 from '../assets/download/4.jpg';
import swiperImg5 from '../assets/download/5.jpg';
/* ------------------------------ 下载页------------------------------  */

/* ------------------------------ browser------------------------------  */
import wechatAndroidImgUrl from '../assets/browser/wechat_android.png';
import wechatIosImgUrl from '../assets/browser/wechat_ios.png';
/* ------------------------------ browser------------------------------  */

/* ------------------------------ play页面------------------------------  */
import palyActiveImgUrl from '../assets/play/play-active.svg';
import palyVideoPlayerLoading from '../assets/play/loading.gif';
/* ------------------------------ play页面------------------------------  */

/* ------------------------------ shortVideo页面 ------------------------------ */
import likeImgUrl from '../assets/shortVideo/shortVideo_like.png';
import shareImgUrl from '../assets/shortVideo/shortVideo_share.png';
import errImgUrl from '../assets/shortVideo/shortVideo_err.png';
/* ------------------------------ shortVideo页面 ------------------------------ */

/* ------------------------------ live页面------------------------------  */
import livePageLogo from '../assets/common/logo0.png';
/* ------------------------------ live页面------------------------------  */

/* ------------------------------ personPage------------------------------  */
/* ------------------------------ personPage------------------------------  */

/* ------------------------------ notFound------------------------------  */
import notFoundPic from '../assets/common/not-found.svg';
/* ------------------------------ notFound------------------------------  */

/* ------------------------------ active------------------------------  */
import activeLoading from '../assets/activity/page-loading.gif'; //gif 动图，，目前貌似失效的
import slideMoreImgUrl from '../assets/activity/slide-more.png';  //左右滑更多
import activeDefaultElephantImgUrl from '../assets/activity/elephant.png'; //活动页 默认站位图
/* ------------------------------ active------------------------------  */

/* ------------------------------ VideoPlayer------------------------------  */
// import activeDefaultElephantImgUrl from '../assets/activity/elephant.png'; //活动页 默认站位图
// import activeDefaultElephantImgUrl from '../assets/activity/elephant.png'; //活动页 默认站位图
/* ------------------------------ VideoPlayer------------------------------  */

/* ------------------------------ htmlPage ------------------------------- */
import copyright1 from '../assets/htmlPage/copyright-1.png'; //
import copyright2 from '../assets/htmlPage/copyright-2.png'; //
/* ------------------------------ htmlPage ------------------------------- */

export const COMMON_IMG_URL = {
    toTopImgUrl, logoImgSrc, searchIconSrc, clearIconSrc, defaultUserInfoAvatarImgUrl
};
/* searchPage */
export const SEARCH_PAGE_IMG_URL = {
    youxiangImgUrl,
    leshiImgUrl,
    noMovieImgUrl,
    playImgUrl,
    tencentImgUrl,
    qiyImgUrl,
    youkuImgUrl,
    souhuImgUrl,
    acfunImgUrl,
    sinaImgUrl,
    tudouImgUrl,
    bilibiliImgUrl,
    mgtvImgUrl,
    pptvImgUrl,
    huashuImgUrl,
    othersImgUrl
};
/* indexpage */
export const INDEX_PAGE_IMG_URL = {
    signUnique, signHomemade, loadErrorImgUrl, homeMoreUrl, homeChangeUrl, homePlayImgUrl
};

/* download */
export const DOWNLOAD_IMG_URL = {
    phoneImgUrl, rotateImgUrl, swiperImgs: [
        swiperImg1,
        swiperImg2,
        swiperImg3,
        swiperImg4,
        swiperImg5,
    ]
};
/* download */
export const BROWSER_OPEN_IMG_URL = {
    wechatIosImgUrl, wechatAndroidImgUrl
};

/* palyPage */
export const PLAY_PAGE_IMG_URL = {
    palyActiveImgUrl, palyVideoPlayerLoading
};

/* shortvideo */
export const SHORT_VIDEO_IMG_URL = {
    likeImgUrl, shareImgUrl, errImgUrl,
};

/* 在线 */
export const LIVE_PAGE_IMG_URL = {
    livePageLogo,
};

/* 个人主页分享 */
export const PERSON_PAGE_IMG_URL = {
    // defaultUserInfoAvatarImgUrl,
};

export const NOT_FOUND_IMG_URL = {
    notFoundPic
}

export const ACTIVE_IMG_URL = {
    activeLoading, slideMoreImgUrl, activeDefaultElephantImgUrl
}

export const HTMLPAGE_IMG_URL = {
    copyright1, copyright2,
}
