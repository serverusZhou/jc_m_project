import { getVideoListBySearch, getHotSearchVideoList } from '../services/searchPage';
import { getUrlParam, isArray, wxShare } from 'utils/toolFunc'
import { SEARCH_PAGE_CONST, } from 'utils/constant';
import { DEFAULT_SHARE } from 'utils/config';

export default {
  namespace: 'searchPageM',
  state: {
    videoList: [], //搜索结果列表
    searchKeyWord: '',
    searchContent: null,
    showSuggest: false,
    showLightShade: false,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // const { location } = history;
      history.listen(location => {

        wxShare('有象视频', '看剧追片，有象就够', DEFAULT_SHARE);

        if (/^\/search$/.test(location.pathname)) {
          const keyword = decodeURI(getUrlParam('keyword'));
          dispatch({
            type: 'getVideoListBySearch', payload: {
              keyword
            }
          })
          /* ###待优化### 优化方向，将这个塞到 getVideoListBySearch 里*/
          dispatch({
            type: 'save', payload: {
              searchKeyWord: keyword,
              searchContent: keyword,
            }
          });
        }
      });
    },
  },

  effects: {

    /* 获取搜索结果列表 */
    *getVideoListBySearch({ payload }, { call, put, select }) {

      const state = yield select(({ searchPageM }) => searchPageM);
      const { keyword = state.searchKeyWord } = payload || {};
      let videoList = [];//视频列表
      let isShowHotSearch = false;//是否是热门推荐

      /* 
        if 有关键词，调用根据关键词搜索接口，else调推荐接口
      */
      if (keyword) {
        const res = yield call(getVideoListBySearch, {
          word: keyword,
          pageSize: SEARCH_PAGE_CONST.VIDEO_LIST_PAGE_SIZE
        });
        /* 
          if 返回的列表不是空的，videoList 为根据关键词搜索的数据，
          else,调用热门推荐接口,videoList 是热门推荐值, isShowHotSearch = true
        */
        if (isArray(res.data.videos, true)) {
          videoList = res.data.videos.filter((item) => item.status === 2);
          yield put({
            type: 'save', payload: {
              videoList,
              isShowHotSearch,
            }
          });
        } else {
          yield put({ type: 'getHotSearchList', });
        }
      } else {
        yield put({ type: 'getHotSearchList', });
      }

    },
    /* 获取热门推荐结果 */
    *getHotSearchList({ payload }, { call, put, select }) {
      const hotSearchRes = yield call(getHotSearchVideoList, {
        pageSize: SEARCH_PAGE_CONST.VIDEO_LIST_PAGE_SIZE
      });
      const videoList = (hotSearchRes.data && isArray(hotSearchRes.data.videos)) ? [...hotSearchRes.data.videos] : [];

      yield put({
        type: 'save', payload: {
          videoList, isShowHotSearch: true
        }
      });
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
