import React from 'react'

import styles from './index.less'

const LiveHeader = ({ gotoAppFun,logo }) => {
	return (
		<div className={styles["header"]}>
			<div className={styles["logo"]}>
				<a href="/">
					<img src={logo} alt="" />
				</a>
			</div>
			<div className={styles["btn-box"]}>
				<div className={styles['open']} onClick={gotoAppFun}>APP内打开</div>
				<div className={styles['download']} onClick={gotoAppFun}>下载APP</div>
			</div>
		</div>
	)
};

export default LiveHeader;