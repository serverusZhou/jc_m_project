import { getVideoBaseInfo, getRecommendList } from '../services/playPage';
import { getUrlParam, isArray } from 'utils/toolFunc'
import { IMAGE_URL, VIDEO_URL } from 'utils/config';
const RECOMMEND_LIST_LIMIT = 18;
export default {
	namespace: 'playPageM',
	state: {
		videoBaseId: '', //视频id
		videoDetailId: '', //剧集id
		videoInfos: {},
		// loading:{},
		searchContent: null,
		showSuggest: false,
		vOptions: {}
	},

	subscriptions: {
		setup({ dispatch, history }) {
			// const { location } = history;
			history.listen(location => {
				const reg = new RegExp(/^(\/play\/)([\d\w]+)$/);
				if (reg.test(location.pathname)) {
					// 获取 视频id 
					const videoBaseId = RegExp.$2;
					// 剧集id
					const videoDetailId = decodeURI(getUrlParam('videoDetailId'));
					dispatch({ type: 'commonM/getChannels' });
					dispatch({
						type: 'getVideoBaseInfo', payload: {
							videoBaseId, videoDetailId
						}
					})

				}
			});
		},
	},

	effects: {
		/* 获取频道视频 */
		*getVideoBaseInfo({ payload }, { call, put, select }) {
			const state = yield select(({ playPageM }) => playPageM);
			/* 默认值都存 */
			const { videoBaseId = state.videoBaseId, videoDetailId = state.videoDetailId } = payload || {};
			if (videoBaseId !== state.videoBaseId || videoDetailId !== state.videoDetailId) {

				const res = yield call(getVideoBaseInfo, {
					videoBaseId,
					videoDetailId
				});

				if (res) {
					const videoInfos = res.data;
					let episodes = [], currEpisode = '', vOptions = {};
					/* 下面获取当前播放的感觉没啥必要，直接用videoDetails id 应该可以。暂时没时间改 */
					if (videoInfos && isArray(videoInfos.vVideoDetailRspVos) && (typeof (videoInfos.currentIndex) === 'number')) {
						currEpisode = videoInfos.vVideoDetailRspVos[videoInfos.currentIndex].episodeDisplay;
						episodes = videoInfos.vVideoDetailRspVos.map((item) => {
							return {
								episodeDisplay: item.episodeDisplay,
								title: item.title,
								videoDetailId: item.videoDetailId,
								images: item.images,
								subTitle: item.subTitle,
							}
						});

						/* poster */
						let images = isArray(videoInfos.images, true) ? videoInfos.images : [];
						let imagesInfo = images.filter((item) => item.scale === 1);
						let poster = isArray(imagesInfo, true) ? IMAGE_URL + imagesInfo[0].url : null;

						/* videoSource */

						/* ******************** test mp4 ******************** */
						const mp4Lists = videoInfos.vVideoDetailRspVos[videoInfos.currentIndex].videoResourceStatusVo.mp4Claritys;
						vOptions = {
							sources: isArray(mp4Lists) ? mp4Lists.map(item => {
								return {
									src: VIDEO_URL + item.url,
									type: 'video/mp4',
									label: item.clarity,
									res: item.clarity.slice(0, item.clarity.length - 1)
								};
							}) : [],
							poster,
						};
						/* ******************** test mp4 ******************** */

						/* ******************** test m3u8 ******************** */
						// const m3u8Clarity = videoInfos.vVideoDetailRspVos[videoInfos.currentIndex].videoResourceStatusVo.m3u8Clarity;
						// vOptions = {
						// 	sources: { ...m3u8Clarity, url: VIDEO_URL + m3u8Clarity.url },
						// 	poster,
						// 	type: 'm3u8'
						// };
						/* ******************** test m3u8 ******************** */
					};


					let newVideoDetailId = videoDetailId || (episodes[0] ? episodes[0].videoDetailId : '');
					yield put({
						type: 'save', payload: {
							videoBaseId,
							videoDetailId: newVideoDetailId,
							videoInfos,
							episodes,
							currEpisode,
							vOptions,

							// loading: false
						}
					});
					yield put({
						type: 'getRecommendList', payload: {
							videoBaseId, videoInfos
						}
					})
				}
			}
		},

		/* 获取推荐列表 */
		*getRecommendList({ payload }, { call, put, select }) {
			const state = yield select(({ playPageM }) => playPageM);
			/* 默认值都存 */
			const { videoBaseId = state.videoBaseId, videoInfos = state.videoInfos } = payload || {};

			const res = yield call(getRecommendList, {
				videoBaseId,
				limit: RECOMMEND_LIST_LIMIT
			});

			if (res) {

				const recommendLists = isArray(res.data, true) ? res.data.map(
					(item, key) => {
						let imgUrl = item.imgUrl;
						if (videoInfos.categories === 1 || videoInfos.categories === 2) {
							item.images.forEach(image => {
								if (image.scale === 1) {
									imgUrl = image.url;
								}
							});
						}


						return { ...item, imgUrl, }
					}
				) : [];

				yield put({
					type: 'save', payload: {
						recommendLists,
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
