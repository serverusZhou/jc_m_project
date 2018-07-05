import { getHotCommandvideoList, getShortVideoData, } from '../services/shortVideo';

import { wxShare } from 'utils/toolFunc';

export default {
  namespace: 'shortVideoM',
  state: {
    shortVideoId: '', //路由传过来的id
    hotRecommandvideoList: [],
    introduction: '',
    avatar: '',
    nickName: ' ',
    shareTitle: '',
    likeCount: 0,
    shareCount: 0,
    bytesCount: 0,//字符数
    deleteStatus: false,
    vOptions: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // const { location } = history;
      history.listen(location => {
        const reg = new RegExp(/^(\/shortVideo\/)([\d\w]+)$/);
        if (reg.test(location.pathname)) {
          // location.pathname.match(reg);
          /* 获取 视频id */
          let shortVideoId = RegExp.$2;
          dispatch({
            type: 'save', payload: {
              shortVideoId
            }
          });
          dispatch({
            type: 'getShortVideoData', payload: {
              shortVideoId
            }
          });
          dispatch({
            type: 'getHotCommandvideoList', payload: {
              shortVideoId
            }
          })
        }

      });
    },
  },

  effects: {

    /* 获取频道视频 */
    *getHotCommandvideoList({ payload }, { call, put, select }) {

      // const state = yield select(({ shortVideoM }) => shortVideoM);
      // const { shortVideoId = state.shortVideoId } = payload || {};
      /* ！！!【之前的逻辑】，猜测是分页，然后页数随机，但是猜不透为啥要取1-27的随机数 */
      let offset = Math.floor((Math.random() * 260) + 1);
      const res = yield call(getHotCommandvideoList, {
        offset,
        limit: 12
      });

      if (res) {
        let hotRecommandvideoList = res.data.videoShortVos;

        yield put({
          type: 'save', payload: {
            hotRecommandvideoList,
          }
        });
      }
    },
    /* 根据路由的videoId 获取当前播放的视频id  */
    *getShortVideoData({ payload }, { call, put, select }) {
      const state = yield select(({ shortVideoM }) => shortVideoM);
      const { shortVideoId = state.shortVideoId } = payload || {};

      const res = yield call(getShortVideoData, {
        id: shortVideoId,
      });
      if (res) {
        const data = res.data || {};
        let {
          introduction,
          avatar,
          nickName = ' ',
          title: shareTitle,
          likeCount,
          shareCount,
          picUrl: poster
        } = data;
        /* 过万 向上取整，显示几万 */
        likeCount = likeCount > 9999 ? (likeCount / 10000).toFixed(1) + 'w' : likeCount;
        shareCount = shareCount > 9999 ? (shareCount / 10000).toFixed(1) + 'w' : shareCount;
        introduction = introduction || '';
        let vOptions = {
          poster,
        };
        let { bytesCount, deleteStatus } = state;
        if (data.status === 1) {
          vOptions = {
            ...vOptions,
            sources: [{
              src: data.playUrl,
              type: 'video/mp4',
            }],
          }
        } else {
          deleteStatus = true;
        };
        wxShare('@' + nickName + '发了一个有趣的有象短视频，快去围观打call吧~', shareTitle + ',' + introduction, vOptions.poster);
        for (let i = 0; i < introduction.length; i++) {
          let c = introduction.charAt(i)
          if (/^[\u0000-\u00ff]$/.test(c)) {
            bytesCount += 1;
          } else {
            bytesCount += 2;
          }
        };
        yield put({
          type: 'save', payload: {
            bytesCount,
            deleteStatus,
            avatar,
            nickName,
            shareTitle,
            likeCount,
            shareCount,
            introduction,
            vOptions,
          }
        });
      }
    },

  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
