import React from 'react'
import styles from './index.less'
import { isArray } from 'utils/toolFunc';

import { IMAGE_URL, } from 'utils/config';


export default class Advertising extends React.Component {

	scrollNum = () => {
		const { number = '', idx } = this.props;
		const currentNum = number.split ? number.split('')[idx] : '';
		return 'col' + idx + ' currentNum' + currentNum;
	}
	componentDidMount = () => {
		this.scrollNum()
	}
	render() {
		const { mdata } = this.props;
		return (
			<div className={styles["advertising"]}>
				{
					isArray(mdata) && mdata.map((adv, index) => {
						return adv.contentUrl ? (
							<a href={adv.contentUrl}>
								<img src={IMAGE_URL + adv.imageUrl} alt="" />
							</a>
						) : (<img src={IMAGE_URL + adv.imageUrl} alt="" />)
					})
				}
			</div >
		)
	}
}