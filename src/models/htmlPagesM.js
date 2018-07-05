import { getQAlist, } from '../services/htmlPages';
import { isArray, } from 'utils/toolFunc';

export default {
    namespace: 'htmlPagesM',
    state: {
        QAlist: [],
    },

    subscriptions: {
        setup({ dispatch, history }) {
            // const { location } = history;
            history.listen(location => {
                if (location.pathname === '/pages/help.html') {
                    dispatch({
                        type: 'getQAlist', payload: {}
                    })
                }
            });
        },
    },

    effects: {
        /* 获取频道视频 */
        *getQAlist({ payload }, { call, put, select, all }) {
            const res = yield call(getQAlist);
            if (res) {
                let QAlist = isArray(res.data.helpList) ? res.data.helpList : [];
                yield put({
                    type: 'save', payload: {
                        QAlist,
                    }
                });
            } else {
            }

        },
    },

    reducers: {
        save(state, action) {
            return { ...state, ...action.payload };
        },
    },

};
