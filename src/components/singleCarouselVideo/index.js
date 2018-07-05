import React from 'react'
// import LazyLoad from 'react-lazyload';
import { Link } from 'react-router-dom';

import { IMAGE_URL } from 'utils/config';
import styles from './index.less'

const SingleCarouselVideo = ({ singleVideoData, mode, layout }) => {
  const innerCpt = (
    <div className={styles["single-video-img-wrap"]}>
      {/* <LazyLoad > */}
      <img className={styles["single-video-img"]} src={IMAGE_URL + singleVideoData.imgurl} alt='' />
      {/* </LazyLoad> */}
      <div className={styles["single-video-info"]}>
        {singleVideoData.name && <h3 className={styles["single-video-name"]}>{singleVideoData.name}</h3>}
        {mode === 'large' && <h3 className={styles["single-video-desc"]}>{singleVideoData.subName}</h3>}
      </div>
    </div>);
  return singleVideoData ? (
    singleVideoData.videoId ? (
      <Link to={{
        pathname: `/play/${singleVideoData.videoId}`,
        state: {
          videoBaseId: singleVideoData.videoId,
        },
      }}>
        {innerCpt}
      </Link>) : (
        <a href={singleVideoData.url} style={{ display: 'inline-block', position: 'relative' }}>
          {innerCpt}
        </a>)
  ) : null;
};

export default SingleCarouselVideo;