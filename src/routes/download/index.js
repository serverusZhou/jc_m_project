/**
 * @author GP
 * @data 2018.4.10
 * @email gengpeng@jcgroup.com.cn
 * @desc 下载
 */
import React from 'react';
// import { connect } from 'dva';
import Swiper from 'components/swiper';


import { wxShare, getUrlParam } from 'utils/toolFunc'
import { DOWNLOAD_IMG_URL } from 'utils/imgUrl'
import styles from './index.less';
const { swiperImgs, rotateImgUrl } = DOWNLOAD_IMG_URL;

export default class DownLoad extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isShowRotate: false,//是否展示 竖屏横屏 提示
		}
	}

	/* 检查是横屏还是竖屏 */
	checkOrientation = () => {
		let isShowRotate = (window.orientation === 180 || window.orientation === 0) ? false : true;
		if (this.state.isShowRotate !== isShowRotate) {
			this.setState({
				isShowRotate
			})
		}
	}


	countDownload = () => {
		var oReq = new XMLHttpRequest()
		const { location } = window;
		const url = location.href;
		let type = url.indexOf('?') > -1 ? '&' : '?';
		oReq.open('GET', `${url}${type}downclick=1&t=${Date.now()}`)
		oReq.send()
	}

	/* 点击下载事件 */
	handleDownLoadClick = () => {
		const { location } = window;
		const ua = navigator.userAgent;
		let channel = getUrlParam('channel');
		this.countDownload();
		if (/MicroMessenger/i.test(ua)) {
			location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.daxiang.live'
		} else if (/android/i.test(ua)) {
			if (channel) {
				location.href = `http://dx-downloads-test.itangchao.me/daxiang-live-A_${channel}-release.apk`
			} else {
				location.href = 'http://dx-downloads-test.itangchao.me/daxiang-live-A_OFFICAL-release.apk'
			}
		} else if (/iPhone/i.test(ua)) {
			if (channel) {
				location.href = `https://itunes.apple.com/app/apple-store/id1235011792?pt=118654704&ct=I_${channel}&mt=8`
			} else {
				location.href = 'https://itunes.apple.com/us/app/id1235011792?l=zh&ls=1&mt=8'
			}
		}
	}

	componentDidMount = () => {
		wxShare('有趣的人都在这里看视频', '无广告, 无会员, 超高清看片', 'http://dx-image-test.itangchao.me/logo_app_share_180_180.jpg');
		this.checkOrientation();
		window.addEventListener('orientationchange', () => {
			this.checkOrientation();
		});
	}

	render() {
		return (
			<div className={styles["download-box"]}>
				{
					/* 面罩 */
					!this.state.isShowRotate && (
						<div className={styles["rotate"]}>
							<img src={rotateImgUrl} alt="" />
							<div className={styles["tip"]}>请在竖屏状态下查看~</div>
						</div>
					)
				}
				<Swiper slideMore={false} axis={'y'} containerStyle={{ height: '100vh' }} isDownArray isToTopBar>
					{/* <div className={styles["item-box"]}>
						<div className={styles["logo"]}></div>
						<div className={styles["title"]}></div>
						<div className={styles["phone"]}>
							<img src={phoneImgUrl} alt='' />
						</div>
						<div className={styles["btn"]} onClick={this.handleDownLoadClick}>下载APP</div>
					</div> */}
					{
						((length) => {
							let rtn = [];
							for (let i = 0; i < length; i++) {
								rtn.push(

									<div className={styles["item-box"]}>
										<img src={swiperImgs[i]} alt="" />
										<div className={styles["btn"]} onClick={this.handleDownLoadClick}>下载APP</div>
										{/* <div class="next" @click="slideNext"></div> */}
									</div>
								)

							}
							return rtn;
						})(5)
					}
				</Swiper>

			</div >
		)
	}
}


