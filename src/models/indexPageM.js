import { getLegoChannels, getBannerList } from '../services/indexPage';
// import { getChannels } from '../services/common';
import parseUrl from 'url-parse'
import { getQuery, isArray,wxShare } from 'utils/toolFunc'
import { DEFAULT_SHARE } from 'utils/config';
export default {
  namespace: 'indexPageM',
  state: {
    channelId: '0', //当前页
    bannerList: [],//轮播
    pageNo: 1, //视频列表的页数
    lastPage: false,//视频列表是否到最后一页了
    legoChannels: [],//视频列表的
    searchContent: null,//头部搜索内容
    showSuggest: false,//是否展示搜索建议
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // const { location } = history;
      history.listen(location => {
        if (/^\/index\/\d+$/.test(location.pathname)) {
          /* 其实此处不需要在判断 */
          // let channelIds = loca，因为上面一行的if 已经判断了，到这一步肯定能解析出来数字，tion.pathname.match(/\d+/);
          // let channelId = channelIds ? channelIds[0] : undefined;
          let channelId = location.pathname.match(/\d+/)[0];

          dispatch({ type: 'commonM/getChannels' });
          dispatch({
            type: 'getLegoChannels', payload: {
              channelId, isInit: true
            }
          })
          dispatch({
            type: 'getBannerList', payload: {
              channelId
            }
          })

          wxShare('有象视频', '看剧追片，有象就够', DEFAULT_SHARE);
        }
      });
    },
  },

  effects: {
    /* 获取频道视频 */
    *getLegoChannels({ payload }, { call, put, select }) {
      const state = yield select(({ indexPageM }) => indexPageM)
      /* 默认值都存 */
      const { isInit = false, channelId = state.channelId } = payload || {};
      const pageNo = isInit ? 1 : state.pageNo;
      /* if  视频列表 不是最后一页 */
      if (isInit || (!isInit && !state.lastPage)) {
        /* 开启动画 */
        yield put({
          type: 'save', payload: {
            videoListLoading: true
          }
        });
        const res = yield call(getLegoChannels, {
          channelId,
          pageNo,
        });

        if (res) {
          /* 如果是 isInit 为 true 就表示初始化，不要之前的数据了 */
          let legoChannels = isInit ? [] : [...state.legoChannels]
          legoChannels = [
            ...legoChannels,
            ...(isArray(res.data.legoChannels) ? res.data.legoChannels.filter(item => {
              //过滤下，if layoutId === 6 或者 layoutId === 7 扔了
              return item.layoutId !== 6 && item.layoutId !== 7
            }) : [])
          ];
          yield put({
            type: 'save', payload: {
              channelId,
              legoChannels,
              // lastPage: isInit ? false : (res.data.page ? res.data.pager.lastPage : false),
              lastPage: (res.data.pager ? res.data.pager.lastPage : false),
              pageNo: pageNo + 1,
              videoListLoading: false
            }
          });
        }
      }
    },
    /* 获取BannerList */
    *getBannerList({ payload }, { call, put, select }) {

      const state = yield select(({ indexPageM }) => indexPageM)
      const { channelId = state.channelId } = payload || {};
      const res = yield call(getBannerList, {
        channelId,
      });
      if (res) {
        let bannerList = [];
        /* 把app 的url 转换成前端的url */
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].schemeUrl.substring(0, 4) !== 'http') {
            let url = parseUrl(res.data[i].schemeUrl, {})
            let action = getQuery('action', url.query)
            if (action === 'videoPlay') {
              bannerList.push({
                ...res.data[i],
                videoBaseId: getQuery('videoId', url.query)
              })
            } else if (action === 'webView') {
              /* 是http 的链接 直接调用 */
              bannerList.push({
                ...res.data[i],
                httpLink: true,
                schemeUrl: getQuery('url', url.query)
              })
            } else if (action === 'livePlay') {
              /* 直播 */
              bannerList.push({
                ...res.data[i],
                roomId: getQuery('id', url.query),
                liveLink: true
              })
            }
          } else {
            bannerList.push({
              ...res.data[i],
              httpLink: true
            })
          }
        }

        yield put({
          type: 'save', payload: {
            bannerList, channelId
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
