import React from 'react';
import VideoPlayer from 'components/videoPlayer';
import styles from './index.less';

const VideoPlayerBox = (props) => {
	const {
		videoJsOptions,
		shareTitle,
		bytesCount,
		introduction,
		likeImgUrl,
		shareImgUrl,
		likeCount,
		shareCount,
	} = props;

	let gotoAppFun = typeof (props.gotoAppFun) === 'function' ? props.gotoAppFun : () => { };

	return (
		<div>
			<VideoPlayer {...videoJsOptions} />
			<div className={styles["detailTitle"]}>{shareTitle}</div>
			{
				(bytesCount <= 30) ? (
					<div className={styles["detailIntroduction"]}>{introduction}</div>
				) : (
						<marquee className={styles["detailIntroduction"]}>{introduction}</marquee>
					)
			}
			<div className={styles["count-box"]} onClick={gotoAppFun}>
				<div className={styles["likeCount"]}>
					<img src={likeImgUrl} alt='' />
					<span>
						{likeCount}
					</span>
				</div>
				<div className={styles["shareCount"]}>
					<img src={shareImgUrl} alt='' />
					<span>
						{shareCount}
					</span>
				</div>
			</div>
		</div>
	)
}
export default VideoPlayerBox;