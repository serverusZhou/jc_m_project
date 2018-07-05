import React from 'react';
import { isArray } from 'utils/toolFunc.js';
import styles from './index.less';
// const shortVideoHotRecomandTitle = '—— 今日热门推荐 ——';

/* 热门推荐列表 */
const HotRecommand = ({ hotRecommandvideoList, gotoAppFun }) => {
	return (
		<div>
			<div className={styles["listTitle"]}>—— 今日热门推荐 ——</div>
			<div className={styles["video-list"]}>
				{
					isArray(hotRecommandvideoList) && hotRecommandvideoList.map((item, key) => (
						<div key={key} onClick={() => { gotoAppFun(item.id) }} className={styles["video-box"]} style={{ background: `url(${item.picUrl})` }}>
							<div className={styles["listSingleVideoTitle"]}>{item.title}</div>
						</div>
					))
				}
				<div className={styles["more"]} onClick={gotoAppFun}>
					更多精彩，请前往客户端体验
				</div>
			</div >
		</div>
	)
}
export default HotRecommand