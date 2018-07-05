import React from 'react';

import { IMAGE_URL, } from 'utils/config';
import { isArray } from 'utils/toolFunc';
// import { SEARCH_PAGE_CONST, } from 'utils/constant';
import { SEARCH_PAGE_IMG_URL, } from 'utils/imgUrl';

import styles from './index.less';

/* 图片路径 */
const {
	youxiangImgUrl,
	playImgUrl,
	leshiImgUrl,
	tencentImgUrl,
	qiyImgUrl,
	youkuImgUrl,
	souhuImgUrl,
	acfunImgUrl,
	sinaImgUrl,
	tudouImgUrl,
	bilibiliImgUrl,
	mgtvImgUrl,
	pptvImgUrl,
	huashuImgUrl,
	othersImgUrl,
} = SEARCH_PAGE_IMG_URL;

/* 获取播放源图片 */
const getPlatformImg = (platforms) => {
	let src = '';

	/* 避免数据类型不匹配，全部改成字符串 */
	switch (platforms + '') {
		// 播放平台id(0:大象,1:乐视,2:腾讯,3:爱奇艺,4:优酷,5:搜狐,6:风行,7:新浪,8:土豆,9:哔哩,10:弹幕,11:芒果TV,12:PPTV,13:华数TV,99:其他)
		case '0': {
			src = youxiangImgUrl;
			break;
		}
		case '1': {
			src = leshiImgUrl;
			break;
		}
		case '2': {
			src = tencentImgUrl;
			break;
		}
		case '3': {
			src = qiyImgUrl;
			break;
		}
		case '4': {
			src = youkuImgUrl;
			break;
		}
		case '5': {
			src = souhuImgUrl;
			break;
		}
		case '6': {
			src = acfunImgUrl;
			break;
		}
		case '7': {
			src = sinaImgUrl;
			break;
		}
		case '8': {
			src = tudouImgUrl;
			break;
		}
		case '9': {
			src = bilibiliImgUrl;
			break;
		}
		case '10': {
			src = acfunImgUrl;
			break;
		}
		case '11': {
			src = mgtvImgUrl;
			break;
		}
		case '12': {
			src = pptvImgUrl;
			break;
		}
		case '13': {
			src = huashuImgUrl;
			break;
		}
		case '99': {
			src = othersImgUrl;
			break;
		}
		default:
			break;
	}
	return <img alt='' src={src} />
}

/* 找到要显示的图片 */
const imageLoop = (arr) => {
	/* if 不是数组或者数组为空就直接返回 */
	if (!isArray(arr, true)) return null;


	return arr.map((image, key) => {
		return image.scale === 3 ? (
			<img src={IMAGE_URL + image.url} key={key} alt="" />
		) : null;
	})

}

const VideoList = ({ videoList = [], isShowHotSearch, videoItemOnclick }) => {
	/* ###待优化###  优化方向，把下面的逻辑搬到 models 里去 */
	let newVideoList = isArray(videoList) ? videoList.filter((item) => {
		return item && isArray(item.detailCardVos, true)
	}).map((item, key) => {
		let detailCardVos = item.detailCardVos;
		if (detailCardVos.length > 12 && detailCardVos[0]) {
			const ellipsis = {
				episode: '...',
				title: detailCardVos[0].title,
				duration: detailCardVos[0].duration,
				sourceUrl: detailCardVos[0].sourceUrl,
				episodeDisplay: detailCardVos[0].episodeDisplay,
				videoDetailId: detailCardVos[0].videoDetailId
			}
			detailCardVos = detailCardVos.slice(0, 5).concat(ellipsis).concat(detailCardVos.slice(-6))
		}


		/* 电视剧 */
		let showCheckMore = item.showCheckMore;
		if (item.bizType === 2 && detailCardVos.length > 3) {
			// 综艺剧集卡片条默认显示三条
			detailCardVos = item.detailCardVos.slice(0, 3);
			showCheckMore = true;
		} else {
			showCheckMore = false;
		}
		return {
			...item,
			detailCardVos,
			showCheckMore,
		}
	}) : []

	/* ###待优化###  优化方向，把下面的逻辑搬到 models 里去 */
	// isArray(videoList) && videoList.map((item, key) => {
	// 	if (!item) return null;
	// 	if (isArray(item.detailCardVos)) {
	// 		if (item.detailCardVos.length === 0) {
	// 			videoList.splice(key, 1)
	// 		}
	// 		if (item.detailCardVos.length > 12) {
	// 			// 多剧集默认显示两行
	// 			const data = item.detailCardVos;
	// 			const arrFirstRow = data.slice(0, 5);//第一行
	// 			const arrLastRow = data.slice(-6);//第一行
	// 			if (data[0]) {
	// 				const ellipsis = {
	// 					episode: '...',
	// 					title: data[0].title,
	// 					duration: data[0].duration,
	// 					sourceUrl: data[0].sourceUrl,
	// 					episodeDisplay: data[0].episodeDisplay,
	// 					videoDetailId: data[0].videoDetailId
	// 				}
	// 				item.detailCardVos = arrFirstRow.concat(ellipsis).concat(arrLastRow)
	// 			}
	// 		}
	// 	}
	// 	/* 电视剧 */
	// 	if (item.bizType === 2 && isArray(item.detailCardVos) && item.detailCardVos.length > 3) {
	// 		// 综艺剧集卡片条默认显示三条
	// 		item.detailCardVos = item.detailCardVos.slice(0, 3);
	// 		item.showCheckMore = true;
	// 	} else {
	// 		item.showCheckMore = false;
	// 	}
	// })


	return (
		<ul className={styles["video-list"]} >
			{
				isArray(newVideoList) && newVideoList.map((item, key) => {
					return (
						<li className={styles["video-item"]} key={key}>
							<div className={styles["video-card"]} >
								<div className={styles["video-poster"]} onClick={() => { videoItemOnclick(item.videoBaseId) }}>
									{
										((item.platforms && item.platforms.indexOf(0) >= 0) && isArray(item.images)) && imageLoop(item.images)
									}
									{
										(item.platforms && item.platforms.indexOf(0) < 0 && item.detailCardVos.length > 0) && (
											<a href={item.detailCardVos[0].sourceUrl}>
												{
													isArray(item.images) && imageLoop(item.images)
												}
											</a>
										)
									}
								</div >
								<div className={styles["video-info"]} >
									<h3>{item.name}</h3>
									<p>年代：{item.yearLabelName}</p>
									<p className={styles["actor"]} >演员：{item.actor}</ p>
									<p className={styles["summary"]}>简介：{item.intro}</p>
									<p className={styles["source"]} >播放源：{(item.platforms && item.platforms[0]) && getPlatformImg(item.platforms[0])}</p>
									<div className={styles["play"]} onClick={() => {
										(item.platforms && item.platforms.indexOf(0) >= 0) ? videoItemOnclick(item.videoBaseId) :
											window.location.href(item.detailCardVos[0].sourceUrl);

									}}><img src={playImgUrl} alt="" />立即播放
                    				</div>
								</div>
							</div>
							{
								item.categories === 2 && (
									<ul className={styles["episode-list"]} >
										{
											(item && isArray(item.detailCardVos)) && item.detailCardVos.map((detailCardVo, key) => {
												const inner = item.bizType === 1 ? <p>{detailCardVo.episode}</p> : (
													<p className={styles["episode-item"]}>{detailCardVo.episodeDisplay}{detailCardVo.title}</p>
												)
												return (
													<li className={styles[item.bizType === 2 ? "time-item" : "episode-list-li"]} key={key} onClick={() => {
														(item.platforms && item.platforms.indexOf(0)) >= 0 ? videoItemOnclick(item.videoBaseId, item.videoDetailId) :
															window.location.href(item.sourceUrl);
													}}>{inner}</li>
												)
											})
										}
										{
											(item.bizType === 2 && item.showCheckMore && item.platforms) && (<li className={styles["check-more"]}>
												{
													(item.platforms.indexOf(0) >= 0) && (
														<span onClick={() => { videoItemOnclick(item.videoBaseId, item.checkMoreVideoId) }}>查看更多</span>
													)
												}
												{
													(item.bizType === 2 && item.showCheckMore && item.platforms && item.platforms.indexOf(0) === -1) && (<a href={item.detailCardVos[0].sourceUrl}>查看更多</a>)
												}
											</li>)
										}


									</ul >
								)
							}
						</li >
					)
				})
			}

		</ul >
	)
}

export default VideoList
