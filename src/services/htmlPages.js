import request from 'utils/request';

export function getQAlist(body) {
  return request('/v2/mobile/constant/help', { body }, 'https://daxiangapi.youxiang0210.com');
}
