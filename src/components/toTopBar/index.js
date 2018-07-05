import React from 'react'
import addEventListener from 'rc-util/lib/Dom/addEventListener';

import { COMMON_IMG_URL } from 'utils/imgUrl';
import styles from './index.less'

const { toTopImgUrl } = COMMON_IMG_URL || {};

const getDefaultTarget = () => {
	return window;
}
/* 获取当前滚动的高度 */
const getScroll = (target, top) => {
	if (typeof window === 'undefined') return 0;
	const prop = top ? 'pageYOffset' : 'pageXOffset';
	const method = top ? 'scrollTop' : 'scrollLeft';
	const isWindow = target === window;

	let ret = isWindow ? target[prop] : target[method];
	return ret;
}
/* 动画函数 */
const easeInOutCubic = (t, b, c, d) => {
	const cc = c - b;
	t /= d / 2;
	if (t < 1) {
		return cc / 2 * t * t * t + b;
	} else {
		return cc / 2 * ((t -= 2) * t * t + 2) + b;
	}
};
/* 获取默认的 高度，超过这个高度就显示 */
const getVisibilityHeight = () => {
	if (window.orientation === 90 || window.orientation === -90) {
		return 270;
	} else {
		return 380;
	}
};

export default class ToTopBar extends React.Component {
	// static defaultProps = {
	// 	visibilityHeight: getVisibilityHeight(),
	// };
	constructor(props) {
		super(props)
		this.state = {
			visible: false,//是否能看见toTOP 按钮
			visibilityHeight: getVisibilityHeight(), //
			scrollTop: 0 // 滚动的高度 
		}
		this.timer = null;
	}
	/* 设置滚动高度,利用scrollTop */
	setScrollTop(value) {
		const getTarget = this.props.target || getDefaultTarget;
		const targetNode = getTarget();
		if (targetNode === window) {
			document.body.scrollTop = value;
			document.documentElement.scrollTop = value;
		} else {
			targetNode.scrollTop = value;
		}
	}
	/* 此处应该加注释 */
	toTop = (e) => {
		e.preventDefault()
		const { target = getDefaultTarget } = this.props;
		// const { visibilityHeight } = this.state;

		/* 假装不是匀速，其实是匀速 */
		const scrollTop = getScroll(target(), true);
		clearInterval(this.timer);
		this.timer = setInterval(() => {
			let scrollTop = getScroll(target(), true);
			if (scrollTop <= 0) {
				clearInterval(this.timer)
			}
			this.setState({ scrollTop })
			this.setScrollTop(easeInOutCubic(100, scrollTop, 0, 450));
		}, 1 / scrollTop)
	}
	/* 页面滚动事件 */
	handleScroll = () => {
		const { target = getDefaultTarget } = this.props;
		const { visibilityHeight } = this.state;
		const scrollTop = getScroll(target(), true);
		this.setState({
			visible: scrollTop > visibilityHeight,
		});
	}
	/* 监听翻转事件 */
	orientationchange = () => {
		const newVisibilityHeight = getVisibilityHeight();
		if (this.state.visibilityHeight !== newVisibilityHeight)
			this.setState({
				visibilityHeight: newVisibilityHeight
			})
	}

	componentWillUnmount = () => {
		clearInterval(this.timer)
	}
	componentDidMount = () => {
		/* 注册事件 */
		const getTarget = this.props.target || getDefaultTarget;
		this.scrollEvent = addEventListener(getTarget(), 'scroll', this.handleScroll);
		this.orientationchangeEvent = addEventListener('window', 'orientationchange' in window ? 'orientationchange' : 'resize', this.orientationchange);
		this.handleScroll();
		this.orientationchange();
	}

	render() {

		return this.state.visible ? (
			<div className={styles["to-top"]} onClick={this.toTop}>
				<div className={styles["to-top-icon"]} >
					<img src={toTopImgUrl} alt="" />
				</div>
			</div>
		) : null
	}
}