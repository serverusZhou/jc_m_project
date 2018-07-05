import request from 'utils/request';
export function getLiveRoomData(body) {
  return request('/m_web/liveRoom/view', { body });
}

export function getWarmUpVideoList(body) {
  return request('/m_web/liveRoom/warmUpVideoList', { body });
}

export function getRecordByLiveRoomId(body) {
  return request('/m_web/liveRoom/getRecordByLiveRoomId', { body });
}