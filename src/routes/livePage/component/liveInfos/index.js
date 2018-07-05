import React from 'react'

import { isArray } from 'utils/toolFunc';
import styles from './index.less'

const LiveInfos = ({ infoList, }) => {
	return (
		<div className={styles["live-infos"]} >
			{
				isArray(infoList) && infoList.map((item, key) => (
					<div className={styles["info"]} key={key}>
						<h2>{item.name}</h2>
						<p>{item.value}</p>
					</ div>
				))
			}
		</div>
	)
};

export default LiveInfos;