import React from 'react'
import styles from './index.less'

const CardTitle = (props) => {

	const { titleStyleType, cardTitleImgSrc,cardName } = props;
	return (
		<div>
			{
				titleStyleType === 1 ? <div className={styles["title-img"]}>
					<img src={cardTitleImgSrc} alt=''/>
				</div> : <div className={styles["title"]}>{cardName}</div>
			}
		</div>
	)
}
export default CardTitle;