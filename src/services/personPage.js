import request from 'utils/request';

// 分享页面-获取指用户信息   http://xyj.youxiangtv.com/doc/Tebo6yIi5
export function fetchUser(body) {
  return request('/m_web/user/share/temp/get', { body });
}
// 分享页面-获取指定用户上传的短视频接口地址   http://xyj.youxiangtv.com/doc/Tebo6yIi5
export function fetchMyViewList(body) {
  return request('/m_web/video/temp/list', { body });
}
// 分享页面-获取指动态   http://xyj.youxiangtv.com/doc/Tebo6yIi5
export function fetchDynamicsList(body) {
  return request('/m_web/user/action/temp/list', { body });
}

