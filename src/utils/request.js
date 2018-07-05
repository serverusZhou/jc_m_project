import axios from 'axios'
import { BASE_URL } from './config.js'
import { interfaceFormatHandle } from './toolFunc';

axios.defaults.baseURL = BASE_URL // 生产环境
axios.defaults.headers = {
  'Acces-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
}
axios.defaults.data = {
  clientId: 'jc_youxiang_app',
  secret: '13c5b701c1ef49c0b032ce41b9bec5c2',
  uuid: 'web',
}
axios.interceptors.response.use(res => {
  return res.data
}, err => {
  return Promise.reject(err)
})

export default function request(url, options = {}, baseURL) {
  if (baseURL) {
    axios.defaults.baseURL = baseURL
  } else {
    axios.defaults.baseURL = BASE_URL // 生产环境
  }
  return axios.post(url, { ...interfaceFormatHandle(options.body) })
    .then(res => {
      if (res && res.code === 0 && res.data) {
        return res;
      } else {

        return false;
      }
    }).catch(err => console.log(err))
}
