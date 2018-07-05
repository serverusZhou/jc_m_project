/**
 * @author gp
 * @email gengpeng@jcgroup.com.cn
 * @desc 推荐视频列表
 */

import React from 'react'
// // import LazyLoad from 'react-lazyload';
import { Link } from 'react-router-dom';

import styles from './index.less'

import { INDEX_PAGE_IMG_URL, } from 'utils/imgUrl';

/**
 * @name RecommendVideos 
 * @prop {object} item 单个推荐的视频
*/
const RecommendVideos = ({ item }) => {
  /* 公共部分提出 */
  const innerCpt = [
    <div key={'innerCpt0'} className={styles["recommend-video-item"]}>{item.name}</div>,
    <img key={'innerCpt1'} src={INDEX_PAGE_IMG_URL.homePlayImgUrl} alt="" />
  ];

  return item.videoId ? (
    <Link className={styles["recommend-video"]} to={{
      pathname: `/play/${item.videoId}`,
      state: {
        videoBaseId: item.videoId,
      },
    }}>{innerCpt}</Link>) : (
      <a href={item.url} className={styles["recommend-video"]}>
        {innerCpt}
      </a>
    )
};

export default RecommendVideos;    