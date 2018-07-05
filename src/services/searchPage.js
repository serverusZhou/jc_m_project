import request from 'utils/request';

/* 根据关键词搜索 */
export function getVideoListBySearch(body) {
  return request('/m_web/search/selectQueryWord', { body });
}

/* 热门推荐（关键词搜不到的时候） */
export function getHotSearchVideoList(body) {
  return request('/m_web/search/hotSearch', { body });
}