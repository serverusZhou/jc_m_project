import React from 'react'
import styles from './index.less'

const FootTemeplate = (props) => {

	const { footType,footImgSrc } = props;
	/* 如果是0 代表有尾图 */
	const _marginTop = footType === 0 ? '-.1rem' : '.5rem';
	return (
		<div className={styles["foot"]} style={{ marginTop: _marginTop }}>
			{footType === 0 && <img src={footImgSrc } alt=''/>}
		</div>
	)
}
export default FootTemeplate;