import { getChannels, getSuggestList, getSuggestListBySearchContent } from '../services/common';
import { isArray } from 'util';

// import { isArray } from 'utils/toolFunc'`

export default {
  namespace: 'commonM',
  state: {
    channelList: [],
    suggestList: [],//搜索建议
    // loading:{},
  },

  subscriptions: {
    setup({ dispatch, history }) {
    },
  },

  effects: {
    /* 获取频道列表 */
    *getChannels({ payload }, { call, put }) {
      const res = yield call(getChannels, );
      // res.data.map(item => {
      //   item.newVideoName = item.videoName
      // })
      if (res) {
        const channelList = [{ name: '精选', id: 0 }, ...res.data]
        yield put({
          type: 'save', payload: {
            channelList,
          }
        });
      }
    },
    /* 获取推荐搜索关键字 */
    getSuggestList: [function* ({ payload }, { call, put, select }) {
      const state = yield select(({ searchPageM }) => searchPageM);

      const { searchContent = state.searchContent, } = payload || {};

      /* 
        if 没有关键词就调热门列表的，else 就调根据关键词获取建议列表的
        ps: 逻辑不合理，请找后台拼命，我也很无奈
       */
      let suggestList = [];
      if (!searchContent) {
        const res = yield call(getSuggestList, {
          pageSize: 5
        });
        suggestList = (res) ? [...res.data] : [];
      } else {
        const res = yield call(getSuggestListBySearchContent, {
          pageSize: 5,
          word: searchContent
        });
        suggestList = (res && isArray(res.data, true)) ? [...res.data.filter((item) => item.videoName && item.videoBaseId)] : [];
      }
      yield put({
        type: 'save', payload: {
          suggestList,
        }
      });
    }, { type: 'takeLatest' }],
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
