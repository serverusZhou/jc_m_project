import request from 'utils/request';

/* 热门推荐（关键词搜不到的时候）*/
export function getHotCommandvideoList(body) {
  return request('/m_web/video/getMVideoList', { body });
}

/* 根据关键词搜索  */
export function getShortVideoData(body) {
  return request('/m_web/video/getMVideoShortDetail', { body });
}