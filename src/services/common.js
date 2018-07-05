import request from 'utils/request';

/* 获取频道列表 */
export function getChannels(body) {
  return request('/m_web/ableChannel', { body });
}
/* 获取搜索面板的关键词列表 */
export function getSuggestList(body) {
  return request('/m_web/search/hotTop', { body });
}
/* 获取搜索面板的关键词列表 (根据关键词*/
export function getSuggestListBySearchContent(body) {
  return request('/m_web/search/suggest', { body });
}
