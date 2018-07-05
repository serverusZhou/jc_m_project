import React from 'react';
import styles from './index.less';

const VideoNoExist = ({ errImgUrl }) => {
    return (
        <div className={styles["videoNoExist"]}>
            <img src={errImgUrl} className={styles["img"]} alt='' />
            <div className={styles["txt"]} >
                本视频被脑洞大开的原创作者删除啦， 快去看看别的视频吧~
            </div>
        </div>
    )
}
export default VideoNoExist