/**
 * @author xiangrenya <xiangrenya@jcgroup.com.cn>
 * @since 2018-06-05
 */

import React, { Component } from 'react'
import styles from './index.less'
import { ACTIVE_IMG_URL } from 'utils/imgUrl';

export default class ActiveLoading extends Component {
	constructor(props) {
		super(props);
		this.state = {
			num: 0,
			isLoading: true
		}
	}
	componentDidMount() {
		this.startLoaded();
	}
	startLoaded() {
		let timer = setInterval(() => {
			this.setState((state) => {
				return {
					num: state.num + 1
				}
			});
		}, 10);
		setTimeout(() => {
			clearInterval(timer);
			this.fakePrcent();
		}, 840);
	}
	fakePrcent() {
		const { num } = this.state;
		const { isPageLoaded } = this.props;
		let rest = 100 - num;
		let duration = 10;
		if (isPageLoaded) {
			if (rest >= 10) {
				duration = 30;
			} else if (rest < 10 && rest > 5) {
				duration = 50;
			} else {
				duration = 70;
			}
		}
		const timer = setInterval(() => {
			let { num } = this.state;
			if (num === 99) {
				clearInterval(timer);
				this.setState({
					isLoading: false
				})
			}
			this.setState({
				num: num + 1
			})
		}, duration);
	}
	headImgLoadedEvent() {
		const timer = setInterval(() => {
			let { num } = this.state;
			if (num === 99) {
				clearInterval(timer);
			}
			this.setState({
				num: num + 1
			})
		}, 10);
	}
	render() {
		const { num, isLoading } = this.state;
		const { activeLoading } = ACTIVE_IMG_URL;

		return (
			isLoading && <div className={styles['loading-cover']}>
				<div className={styles['content']}>
					<img src={activeLoading} alt="加载中" />
					<p>正在加载...{num}%</p>
				</div>
			</div>
		)
	}
}
