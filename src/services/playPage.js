import request from 'utils/request';

/* 得到基础视频信息 */
export function getVideoBaseInfo(body) {
  return request('/m_web/videoBase/videoBaseInfo', { body });
}

/* 获取推荐列表 */
export function getRecommendList(body) {
  return request('/m_web/channel/recommend', { body });
}
