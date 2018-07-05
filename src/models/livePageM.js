import { getLiveRoomData, getWarmUpVideoList, getRecordByLiveRoomId } from '../services/livePage';
import { getUrlParam, isArray,wxShare } from 'utils/toolFunc'
import { gotoNotFound } from 'utils/jump';
import { IMAGE_URL,DEFAULT_SHARE } from 'utils/config';

const timer = null;
export default {
    namespace: 'livePageM',
    state: {
        liveRoomData: {
        }, //直播的数据
        warmUpVideoList: [],
        liveRoomId: '', //吧liveRoomId也更新上去,
        vOptions: {
            autoplay: false,
            isNeedSwitch: false,
            videoSourcesData: {},
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
                const reg = new RegExp(/^(\/live\/)([\d\w]+)$/);
                if (reg.test(location.pathname)) {
                    // 获取 视频id 
                    const liveRoomId = RegExp.$2;
                    // 剧集id
                    // const videoDetailId = decodeURI(getUrlParam('videoDetailId'));
                    dispatch({
                        type: 'getLiveRoomData', payload: {
                            liveRoomId, history
                        }
                    })
                }
            });
        },
    },

    effects: {
        /* 获取频道视频 */
        *getLiveRoomData({ payload, }, { call, put, select, all }) {
            const state = yield select(({ livePageM }) => livePageM);
            /* 默认值都存 */
            const { liveRoomId, history } = payload || {};
            if (liveRoomId && liveRoomId !== state.liveRoomId) {
                const [res0, res1, res2] = yield [
                    call(getLiveRoomData, { liveRoomId, }),
                    call(getWarmUpVideoList, { liveRoomId, }),
                    call(getRecordByLiveRoomId, { liveRoomId, }),
                ];

                if (res0 && res1 && res2) {

                    const { liveStatus, scheduleTime, playbackUrl, hlsPlayUrl, displayImageUrl } = res0.data;
                    const warmUpVideoList = [];
                    const timeLeft = scheduleTime - Date.now();
                    let status = 0;
                    if (liveStatus === 2) {
                        status = 5 // 直播结束
                    } else if (liveStatus === 0) {
                        status = 4 // 1.时间已到，直播中2.时间未到直播已经提前开始
                    } else if (liveStatus === 1 && warmUpVideoList.length !== 0 && timeLeft > 0) {
                        status = 3 // 直播未开始，有预播影片
                    } else if (liveStatus === 1 && warmUpVideoList.length === 0) {
                        status = 2 // 直播未开始，无预播影片
                    } else if (liveStatus === 1 && timeLeft <= 0) {
                        status = 1 // 时间已到，直播未开始
                    }

                    const liveRoomData = {
                        ...res0.data,
                        status,
                        timeLeft,  //剩下的时间
                    }
                    let peopleWantLook = '';

                    if (liveStatus === 0) {
                        peopleWantLook = `${res2.data.watching}人正在观看`;
                    } else if (liveStatus === 1) {
                        peopleWantLook = `${res2.data.interested}人想看`;
                    } else if (liveStatus === 2) {
                        peopleWantLook = `${res2.data.watched}人已看`;
                    }

                    let newWarmUpVideoList = [],
                        vOptions = {
                            autoplay: false,
                            isNeedSwitch: false,
                            styles: {
                                width: '100%',
                                height: '100%'
                            }
                        };
                    for (let i = 0; i < res1.data.length; i++) {
                        const item = (res1.data[i] && res1.data[i].vVideoDetailRspVos instanceof Array) ? res1.data[i].vVideoDetailRspVos : [];
                        for (let j = 0; j < item.length; j++) {
                            newWarmUpVideoList.push(`https://video.youxiang0210.com/${item[j].videoResourceStatusVo.m3u8Clarity.url}`)
                        }
                    }
                    if (liveStatus === 0) { // 直播中才开始播放直播视频
                        vOptions.videoSourcesData = {
                            data: {
                                url: hlsPlayUrl,
                                type: 'application/x-mpegURL'
                            },
                            type: 'm3u8'
                        };
                    }
                    if (liveStatus === 2 && playbackUrl !== null) { // 已经结束放回放
                        vOptions.videoSourcesData = {
                            data: {
                                url: playbackUrl,
                                type: 'application/x-mpegURL'
                            },
                            type: 'm3u8'
                        };
                    }
                    vOptions.poster = `http://dx-image-test.itangchao.me/${displayImageUrl}`

                    if (newWarmUpVideoList.length !== 0 && liveStatus === 1) {
                        vOptions.videoSourcesData = {
                            data: {
                                url: newWarmUpVideoList[0],
                                type: 'application/x-mpegURL'
                            },
                            type: 'm3u8'
                        };
                    }
                    wxShare(res0.data.title, res0.data.shareSubTitle, (IMAGE_URL + res0.data.displayImageUrl || DEFAULT_SHARE));
                    yield put({
                        type: 'save', payload: {
                            liveRoomId, //吧liveRoomId也更新上去
                            liveRoomData,
                            peopleWantLook,
                            warmUpVideoList: newWarmUpVideoList,
                            vOptions
                            // loading: false
                        }
                    });
                } else {
                    gotoNotFound()
                }
            }
        },
    },

    reducers: {
        save(state, action) {
            return { ...state, ...action.payload };
        },
    },

};
