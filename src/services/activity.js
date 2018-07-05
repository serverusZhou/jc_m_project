import request from 'utils/request';

export function getSourcesFormList(body) {
  return request('/m_web/videoBase/videoBaseInfo', { body });
}
export function getSpecialChannelList(body) {
  return request('/m_web/special/channel/lists', { body });
}
export function getWarmUpVideo(body) {
  return request('/m_web/liveRoom/warmUpVideoList', { body });
}
export function getLiveingStatus(body) {
  return request('/m_web/liveRoom/getRecordByLiveRoomId', { body });
}
export function autoAddLikeNum(body) {
  return request('/m_web/liveRoom/view', { body });
}