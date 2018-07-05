import request from 'utils/request';

/* 获取频道 */
export function getLegoChannels(body) {
  return request('/m_web/lego/channel',{body});
}
/* 获取banner */
export function getBannerList(body) {
  return request('/m_web/banner',{body});
}