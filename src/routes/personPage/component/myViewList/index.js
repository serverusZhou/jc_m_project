import React from 'react';
import styles from './index.less';
import { isArray } from 'utils/toolFunc.js';

function MyViewList({ myViewListLength, myViewList, goToVideo, errorTipText, scroll }) {
	return (
		<div className={styles["myViewList"]} onScroll={(e) => { typeof (scroll) === 'function' && scroll('myViewList', e) }}>
			<div className={styles["row-title"]}>拍单({myViewListLength})</div>
			{
				isArray(myViewList) && myViewList.map((item, key) => (
					<div className={styles["row"]} key={key} onClick={() => { typeof (goToVideo) === 'function' && goToVideo(item) }}>
						<div className={styles["leftBox"]}>
							<div className={styles["img"]} style={{ backgroundImage: `url(${item.picUrl})` }}></div>
						</div>
						<div className={styles["rightBox"]}>
							<div className={styles["title"]}>{item.title}</div>
							<div className={styles["introduction"]}>{item.introduction}</div>
							<div className={styles["time"]}>{item.time}</div>
						</div>
					</div >
				))
			}
		</div >
	)
}

export default MyViewList;