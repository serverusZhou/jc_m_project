import { fetchMyViewList, fetchUser, fetchDynamicsList } from '../services/personPage';
import { getUrlParam, isArray, transformSecondToTime, getAstro, getUnit } from 'utils/toolFunc';
import { gotoNotFound } from 'utils/jump';


export default {
	namespace: 'personPageM',
	state: {
		dynamicsList: [],
		myViewList: [],
		userInfoData: {}, // 个人主页的用户信息
		myViewListPaper: { limit: 5, offset: 1, loading: false, lastPage: false },
		dynamicsListPaper: { limit: 5, offset: 1, loading: false, lastPage: false },
		shareToken: ''
	},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(location => {
				if (/^\/personPage/.test(location.pathname)) {
					let shareToken = getUrlParam('shareToken');
					/* 如果 shareToken(app,后台，前端 三方协定的变量) 没传 ，则直接取notFound界面 */
					if (shareToken === undefined) {
						gotoNotFound();
					} else {
						dispatch({
							type: 'FETCH_USER', payload: {
								shareToken,
								errorCallBack: gotoNotFound
							}
						});
						dispatch({
							type: 'FETCH_MY_VIEW_LIST', payload: {
								shareToken,
								isFirst: true,
								errorCallBack: gotoNotFound

							}
						});
						dispatch({
							type: 'FETCH_DYNAMICS_LIST', payload: {
								shareToken,
								isFirst: true,
								errorCallBack: gotoNotFound
							}
						});
					}
				}
			});
		},
	},

	effects: {
		/* 获取个人主页动态 */
		*FETCH_DYNAMICS_LIST({ payload }, { call, put, select }) {
			const state = yield select(({ personPageM }) => personPageM)
			let { shareToken = state.shareToken, isFirst, dynamicsListPaper = state.dynamicsListPaper, errorCallBack = () => { } } = payload || {};

			if (!dynamicsListPaper.loading && !dynamicsListPaper.lastPage) {
				yield put({ type: 'SAVE_DYNAMICS_LIST_PAPER', payload: { loading: true } });
				const res = yield call(fetchDynamicsList, {
					shareToken,
					limit: dynamicsListPaper.limit, // true number 当前页码，从1开始
					offset: dynamicsListPaper.offset, // true number 记录偏移
				});
				if (res) {
					const { pager = {}, userActionVos = [] } = res.data;
					let dynamicsList = !isFirst ? state.dynamicsList : [];
					dynamicsList = isArray(userActionVos) ? dynamicsList.concat(userActionVos.map(({ actionType, operateType, ...item }, key) => {
						const data = item.data || {};
						let actionName = '';
						let { name, nickName } = data;
						name = `"${!name ? '' : name}"`;
						nickName = `"${nickName === undefined ? '' : nickName}"`;
						if (actionType === 1 && operateType === 1) {
							actionName = `点赞了${name}`;
						} else if (actionType === 1 && operateType === 2) {
							actionName = `收藏了${name}`;
						} else if (actionType === 1 && operateType === 3) {
							actionName = `分享了${name}`;
						} else if (actionType === 1 && operateType === 4) {
							actionName = `取消了对${name}收藏`;
						} else if (actionType === 1 && operateType === 5) {
							actionName = `上传了${name}`;
						} else if (actionType === 2 && operateType === 0) {
							actionName = `取消了对${nickName}关注`;
						} else if (actionType === 2 && operateType === 1) {
							actionName = `关注了${nickName}`;
						} else if (actionType === 2 && operateType === 2) {
							actionName = `分享了有象视频`;
						} else if (actionType === 2 && operateType === 3) {
							actionName = `更新了个人信息`;
						} else if (actionType === 3 && operateType === 6) {
							let videosName = isArray(data) ? data.map(({ name }) => name).join('、') : '';
							actionName = `删除了${videosName}`;
						} else if (actionType === 3 && operateType === 7) {
							actionName = `删除了多个视频`;
						} else {
						}
						return {
							gmtCreated: item.gmtCreated,
							actionName,
						};
					})) : [];

					yield put({ type: 'save', payload: { dynamicsList, shareToken } });
					yield put({
						type: 'SAVE_DYNAMICS_LIST_PAPER', payload: {
							...pager,
							offset: pager.pageNo ? pager.pageNo + 1 : state.dynamicsListPaper.offset,
							pages: pager.pages || state.pages,
							loading: false
						}
					});
				} else {
					errorCallBack()
				}

			}
		},

		/* 获取我拍列表 */
		*FETCH_MY_VIEW_LIST({ payload }, { call, put, select }) {
			const state = yield select(({ personPageM }) => personPageM)
			const { shareToken = state.shareToken, isFirst, myViewListPaper = state.myViewListPaper, errorCallBack = () => { } } = payload || {};

			if (!myViewListPaper.loading && !myViewListPaper.lastPage) {
				yield put({ type: 'SAVE_MY_VIEW_LIST_PAPER', payload: { loading: true } });
				const res = yield call(fetchMyViewList, {
					shareToken,
					limit: myViewListPaper.limit, // true number 当前页码，从1开始
					offset: myViewListPaper.offset, // true number 记录偏移
					type: 1, // true number 0我的上传 1我拍 2有象故事
				});

				if (res) {

					const { videoShortVos = [], pager = {} } = res.data;

					let myViewList = !isFirst ? state.myViewList : [];

					myViewList = isArray(videoShortVos) ? myViewList.concat(videoShortVos.map((item, key) => {
						return {
							title: item.title,
							picUrl: item.picUrl,
							introduction: item.introduction,
							id: item.id,
							time: transformSecondToTime(item.duration),
						};
					})) : [];
					yield put({ type: 'save', payload: { myViewList, shareToken, myViewListLength: pager.records } });
					yield put({
						type: 'SAVE_MY_VIEW_LIST_PAPER', payload: {
							...pager,
							// offset: pager.pageNo ? pager.pageNo + 1 : state.myViewListPaper.offset,
							// 这个意义已经无法描述，直接问后台吧。
							offset: (typeof (pager.pageNo) === 'number' && typeof (pager.pageSize) === 'number') ? pager.pageSize * pager.pageNo : state.myViewListPaper.offset,
							pages: pager.pages || state.pages,
							loading: false
						}
					});
				} else {
					errorCallBack()
				}

			}
		},
		/* 获取我拍列表 */
		*FETCH_USER({ payload }, { call, put, select }) {
			const state = yield select(({ personPageM }) => personPageM)
			const { shareToken = state.shareToken, } = payload || {};

			const res = yield call(fetchUser, {
				shareToken,
			});
			if (res) {
				const standardUnit = [
					{ level: 10000, unit: 'w' },
					{ level: 10000000, unit: 'kw' },
				];

				let {
					fansNumber = 0, // 粉丝数
					focusNumber = 0, // 关注数
					level, // 等级
					area, // 地区
					birthday, // 生日
					sex, // 性别 男1 女0
					individualitySignature,   // 个性签名
					avatar, // 头像
					// ...otherData, //其他

					// videoShortVos = [], pager = {}
				} = res.data || {};

				if (sex === 1 || sex === '1') {
					sex = '男';
				}
				if (sex === 0 || sex === '0') {
					sex = '女';
				}
				const userInfoData = {
					...res.data,
					avatar: avatar,
					fansNumber: fansNumber ? (getUnit(standardUnit, fansNumber)) : 0, /* 处理单位 12000 =》 1.2w */
					focusNumber: focusNumber ? (getUnit(standardUnit, focusNumber)) : 0,
					personInfoList: [
						{
							title: '个人信息',
							id: 0,
							rowList: [
								{
									label: '等级',
									text: level,
								}, {
									label: '性别',
									text: sex,
								}, {
									label: '生日',
									text: getAstro(birthday),
								}, {
									label: '地区',
									text: area,
								}
							]
						}, {
							title: '个性签名',
							id: 0,
							rowList: [
								{
									text: individualitySignature || '暂未填写个人签名',
								},
							]
						},
					],
				};


				yield put({ type: 'save', payload: { userInfoData, shareToken } });
			}
		},

	},


	reducers: {
		save(state, action) {
			return { ...state, ...action.payload };
		},
		SAVE_MY_VIEW_LIST_PAPER(state, action) {
			return {
				...state,
				myViewListPaper: {
					...state.myViewListPaper,
					...action.payload
				}
			};
		},
		SAVE_DYNAMICS_LIST_PAPER(state, action) {
			return {
				...state,
				dynamicsListPaper: {
					...state.dynamicsListPaper,
					...action.payload
				}
			};
		},
	},
};