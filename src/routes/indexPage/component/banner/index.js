import React from 'react'
import Slider from 'react-slick'

import { IMAGE_URL } from 'utils/config';
import { isArray } from 'utils/toolFunc';
import styles from './index.less'
import { Link } from 'react-router-dom';

const Banner = ({ bannerList, sliderProps={} }) => {
	// 轮播prop 详情 https://github.com/akiran/react-slick
	
	/* 将公共部分提出 */
	const getInnerCpt = (item) => {
		return [
			<img key={'innerCpt0'} src={IMAGE_URL + item.imageUrl} className={styles["banner-img"]} alt='' />,
			<div key={'innerCpt1'} className={styles["banner-linear"]}>
				<p className={styles["title"]}>{item.title}</p>
				<p className={styles["sub-title"]}>{item.secondTitle}</p>
			</div>,
		];
	};
	return (
		<div className={styles["banner-wrapper"]}>
			<Slider {...sliderProps}>
				{
					isArray(bannerList)  && bannerList.map((item, key) => {
						/* 此处应该有注释 */
						return (
							<div className={styles["banner-item-box"]} key={key}>
								{
									item.liveLink ? (
										<Link to={{
											pathname: `/live/${item.roomId}`,
											state: {
												roomId:item.roomId,
											},
										}}
										>{getInnerCpt(item)}</Link>
									) : (
											!item.httpLink ? (
												<Link to={{
													pathname: `/play/${item.videoBaseId}`,
													state: {
														videoBaseId:item.videoBaseId,
													},
												}}>{getInnerCpt(item)}</Link>
											) : (<a href={item.schemeUrl}>{
												getInnerCpt(item)
											}</a>)
										)
								}
							</div>
						)
					})
				}

			</Slider>
		</div>
	)
};

export default Banner;