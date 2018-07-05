import React from 'react'
// import LazyLoad from 'react-lazyload';
import { Link } from 'react-router-dom';

import styles from './index.less'
import { IMAGE_URL } from 'utils/config';
import { INDEX_PAGE_IMG_URL } from 'utils/imgUrl';
const { signUnique, signHomemade } = INDEX_PAGE_IMG_URL || {};
const SingleVideo = ({ singleVideoData = {}, mode, isShowSubName }) => {

  const innerCpt = (
    <div>
      <div className={styles["single-video-img-wrap"]}>
        {/* <LazyLoad height={30}> */}
        <img className={styles["single-video-img"]} src={IMAGE_URL + singleVideoData.imageUrl} alt='' />
        {/* </LazyLoad> */}
        {
          (singleVideoData.extMap && singleVideoData.extMap.updateEpisode) && <p className={styles["single-video-update"]}>
            {singleVideoData.extMap.updateEpisode}
          </p>
        }
      </div>
      {
        (singleVideoData.extMap && singleVideoData.extMap.sign) && (
          <div className={styles["video-sign"]}>
            {singleVideoData.extMap.sign === '独播' && <img src={signUnique} alt="独播" />}
            {singleVideoData.extMap.sign === '自制' && <img src={signHomemade} alt="自制" />}
          </div>
        )
      }
      {
        (singleVideoData.extMap && singleVideoData.extMap.clarity) && (
          <span className={styles["video-clarity"]}>
            {singleVideoData.extMap.clarity}
          </span>
        )
      }
      <div className={styles["single-video-info"]}>
        {singleVideoData.name && <h3 className={styles["single-video-name"]}>{singleVideoData.name}</h3>}
        {mode === 'large' && <h3 className={styles["single-video-desc"]}>{singleVideoData.subName}</h3>}
        {isShowSubName && <h3 className={styles["single-video-subName"]}>{singleVideoData.subName}</h3>}
      </div>
    </div>
  );
  
  return singleVideoData ? (
    <div className={styles[`single-${mode}-video`]}>
      {singleVideoData.videoId ? (
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
      }
    </div>) : null;
};

export default SingleVideo;    