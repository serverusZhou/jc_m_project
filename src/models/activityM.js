import { getSpecialChannelList, getWarmUpVideo, autoAddLikeNum, getLiveingStatus } from '../services/activity';
import { getUrlParam, getQuery, isArray, wxShare } from 'utils/toolFunc'
import { bridge, } from 'utils/bridge';
import { IMAGE_URL, VIDEO_URL } from 'utils/config';

export default {
  namespace: 'activityM',
  state: {
    activityId: '',
    models: [], // 卡片列表
    channelInfo: {},
    isLive: false,
    tabs: [], // 直播间列表
    currentTab: null, // 当前直播间index
    curLiveRoomId: '', // 当前直播间ID
    curLiveRoomStatus: undefined,
    likeNum: 0,   // 想看的人数
    watchingNum: 0, // 直播中的观众
    watchedNum: 0, // 累计所有的观众
    vOptions: { // video.js选项
      isSwitcher: false,
      videoSourcesData: {
        data: {},
        type: 'm3u8'
      },
      controls: true,
      poster: '',
      styles: {
        width: '100%',
        height: '100%'
      }
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // const { location } = history;
      history.listen(location => {
        const reg = new RegExp(/^(\/activity\/)([\d\w]+)$/);
        if (reg.test(location.pathname)) {
          const activityId = RegExp.$2;
          dispatch({
            type: 'fetch', payload: {
              activityId,
            }
          })
        }
      });
    },
  },

  effects: {
    *fetch({ payload }, { call, put, select }) {
      const state = yield select(({ activityM }) => activityM);
      /* 默认值都存 */
      let { activityId = state.activityId, } = payload || {};

      /* 开启动画 */
      // yield put({
      //   type: 'save', payload: {
      //     loading: true
      //   }
      // });
      /* if 不是原来的id ，则重新调接口 */

      if (activityId) {
        const res = yield call(getSpecialChannelList, { id: activityId, });
        if (res) {
          let counter = 0;
          let { channelInfo, models } = res.data;
          let activityInfo = { activityId, channelInfo, models };
          let curLiveRoomMetas;
          // 直播间的信息
          let { liveRoomsInfo, tabs } = getLiveRoomsInfo(models);
          let { curLiveRoomStatus } = liveRoomsInfo;
          // 直播间的统计信息
          // 如果curLiveRoomStatus未定，那么当前直播室放的就是点播1x1模板
          if (curLiveRoomStatus !== undefined && liveRoomsInfo.curLiveRoomId !== undefined) {
            const { data } = yield call(getLiveingStatus, { liveRoomId: liveRoomsInfo.curLiveRoomId });
            curLiveRoomMetas = getLiveRoomMetas(data);
          }
          /**
           * 根据不同直播状态，采用不用的播放视频源
           * 0: 直播前 1: 直播中 2：直播后
           */
          let playUrl;
          // 直播前或(直播后并且回放状态未开启)的条件下播放热身视频
          if (curLiveRoomStatus === 1 || (curLiveRoomStatus === 2 && tabs[0].playbackStatus === 0)) {
            const { data } = yield call(getWarmUpVideo, { liveRoomId: tabs[0].liveRoomId });
            playUrl = getWarmUpVideoUrl(data);
          } else if (curLiveRoomStatus === 0) {
            playUrl = tabs[0].hlsPlayUrl;
          } else if (curLiveRoomStatus === 2) {
            playUrl = tabs[0].playbackUrl;
          }
          // 只有直播卡片赋值playUrl，点播卡片liveRoomsInfo已经包含了
          if (curLiveRoomStatus !== undefined) {
            liveRoomsInfo.vOptions.videoSourcesData = {
              data: {
                url: playUrl,
                type: 'application/x-mpegURL'
              },
              type: 'm3u8'
            }
          }
          // layoutId 是4的情况下 需要两个一组。把第二个的multiply制成counter2
          models = isArray(models) ? models.map(item => {
            if (item.cardType === 2 && item.layoutId === 4) {
              counter++;
            }
            return {
              ...item,
              multiply: counter % 2 === 0
            }
          }) : [];

          // states
          let payload;
          if (curLiveRoomStatus !== undefined) {
            payload = {
              ...activityInfo,
              ...liveRoomsInfo,
              ...curLiveRoomMetas
            }
          } else {
            payload = {
              ...activityInfo,
              ...liveRoomsInfo
            }
          }

          yield put({
            type: 'save',
            payload
          });

          // 更改页面标题
          document.title = channelInfo.title;
          // 微信分享
          bridge.call('base_callShareContent', {
            title: channelInfo.shareTitle,
            subTitle: channelInfo.shareDesc,
            imgUrl: IMAGE_URL + channelInfo.shareImg,
            shareUrl: window.location.href
          }, () => {
          });
          wxShare(channelInfo.shareTitle, channelInfo.shareDesc, IMAGE_URL + channelInfo.shareImg);
        }
      }
    },
    *getLiveRoomMetas({ payload }, { call, put, select }) {
      const { curLiveRoomId, curLiveRoomStatus } = yield select(({ activityM }) => activityM);
      if (!curLiveRoomId) {
        return;
      }
      if (curLiveRoomStatus !== undefined && curLiveRoomId !== undefined) {
        const { data } = yield call(getLiveingStatus, { liveRoomId: curLiveRoomId });
        const { likeNum, watchingNum, watchedNum } = getLiveRoomMetas(data);
        yield put({
          type: 'save',
          payload: {
            likeNum,
            watchingNum,
            watchedNum
          }
        });
      }
    },
    *changeLiveRoom({ payload }, { call, put, select }) {
      const state = yield select(({ activityM }) => activityM);
      const { index } = payload;
      if (index === state.currentTab) {
        return;
      }
      let tabs = [...state.tabs];
      tabs.forEach((v, i) => {
        i === index ? v.iscur = true : v.iscur = false;
      });
      let currentTab = index;
      const {liveRoomId, liveRoomStatus, scheduleTime } = tabs[index];
      const curLiveRoomId = liveRoomId;
      const curLiveRoomStatus = liveRoomStatus;
      /**
       * 根据不同直播状态，采用不用的播放视频源
       * 0: 直播前 1: 直播中 2：直播后
       */
      let playUrl;
      // 直播前或(直播后并且回放状态未开启)的条件下播放热身视频
      if (curLiveRoomStatus === 1 || (curLiveRoomStatus === 2 && tabs[index].playbackStatus == 0)) {
        const { data } = yield call(getWarmUpVideo, { liveRoomId: tabs[index].liveRoomId });
        playUrl = getWarmUpVideoUrl(data);
      } else if (curLiveRoomStatus === 0) {
        playUrl = tabs[index].hlsPlayUrl;
      } else if (curLiveRoomStatus === 2) {
        playUrl = tabs[index].playbackUrl;
      }
      let vOptions = {
        isSwitcher: false,
        poster: IMAGE_URL + tabs[index].image,
        videoSourcesData: {
          data: {
            url: playUrl,
            type: 'application/x-mpegURL'
          },
          type: 'm3u8'
        }
      }
      const { data } = yield call(getLiveingStatus, { liveRoomId: curLiveRoomId });
      const curLiveRoomMetas = getLiveRoomMetas(data);
      yield put({
        type: 'save',
        payload: {
          currentTab,
          curLiveRoomId,
          curLiveRoomStatus,
          curLiveRoomscheduleTime: scheduleTime,
          vOptions,
          ...curLiveRoomMetas
        }
      });
    }
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};

/**
 * 获取第一个热身视频播放地址
 * @param {array} data 响应体返回的res.data
 * @returns {string} 第一个热身视频播放地址
 */
const getWarmUpVideoUrl = data => {
  let warmUpVideoUrls = [];
  for (let i = 0; i < data.length; i++) {
    const item = data[i].vVideoDetailRspVos;
    for (let j = 0; j < item.length; j++) {
      warmUpVideoUrls.push(`${VIDEO_URL}${item[j].videoResourceStatusVo.m3u8Clarity.url}`);
    }
  }
  return warmUpVideoUrls[0];
}

/**
 * 获取直播间的信息和状态
 * @param {object} models 专题页下的卡片列表
 * @returns {object} 直播间的信息
 */
const getLiveRoomsInfo = models => {
  let tabs = [];
  let curLiveRoomStatus;
  let liveRoomsInfo;
  models.forEach(item => {
    // 直播卡片
    if (item.cardType === 1) {
      // 多个直播间
      tabs = item.mdata.map((v, i) => {
        return {
          'title': v.name,
          'desc': v.liveDesc,
          'intro': v.liveDesc.slice(0, 89) + '...',
          'iscur': i === 0,
          hlsPlayUrl: v.hlsPlayUrl,
          image: i === 0 ? item.imageBannerUrl : v.imgUrl,
          liveRoomStatus: v.liveRoomStatus,
          liveRoomId: v.liveRoomId,
          playbackStatus: v.playbackStatus,
          playbackUrl: v.playbackUrl,
          scheduleTime: v.scheduleTime
        };
      });
      liveRoomsInfo = {
        tabs,
        isLive: true,
        currentTab: 0,
        curLiveRoomId: tabs[0].liveRoomId,
        curLiveRoomStatus: tabs[0].liveRoomStatus,
        curLiveRoomscheduleTime: tabs[0].scheduleTime,
        vOptions: {
          isSwitcher: false,
          poster: IMAGE_URL + tabs[0].image
        }
      };
    }
    // 点播卡片1x1模板
    if (item.cardType === 2 && item.layoutId === 1) {
      liveRoomsInfo = {
        isLive: false,
        tabs: [{
          desc: item.mdata.videos[0].intro,
          intro: item.mdata.videos[0].intro.slice(0, 89) + '...',
          iscur: true
        }],
        vOptions: {
          isSwitcher: false,          
          poster: IMAGE_URL + item.imageBannerUrl,
          videoSourcesData: {
            data: {
              url: VIDEO_URL + item.mdata.videos[0].videoResourceStatusVo.m3u8Clarity.url,
              type: 'application/x-mpegURL'
            },
            type: 'm3u8'
          }
        }
      };
    }
  })
  return {
    liveRoomsInfo,
    tabs
  }
}

/**
 * 获取当前直播间的一些统计信息（想看人数，正在观看的人数，已观看过的人数）
 * @param {object} data 统计信息
 * @returns {object}
 */
const getLiveRoomMetas = data => {
  const { interested, watching, watched } = data;
  return {
    likeNum: interested.toString(),
    watchingNum: watching + interested + '',
    watchedNum: watched.toString()
  }
}