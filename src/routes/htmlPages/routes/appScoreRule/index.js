import React from 'react'

import styles from './index.less'

const AppScoreRule = () => {
	document.title = '金币规则';
	return (
		<div className={styles["appScoreRule"]}>
			<p className={styles["title"]}>什么是有象金币？</p>
			<p className={styles["info"]}>
				有象金币是有象视频平台全新推出的通用金币，根据用户的行为，例如每日签到、视频分享点赞、小视频发布等任务完成，通过累计金币的方式推出的一项长期回馈计划。
  			</p>
			<p className={styles["title"]}>如何获得有象金币？</p>
			<p className={styles["info"]}>
				1. 新人成就
				<br /> 首次设置全部资料，奖励10枚金币
				<br /> 首次成功上传（审核通过）短视频，奖励10枚金币
				<br /> 2. 签到成就
				<br /> 每日签到后可领取1枚金币
				<br /> 每月连续第7天签到，奖励额外3枚金币
				<br /> 每月连续第14天签到，奖励额外5枚金币
				<br /> 每月连续第21天签到，奖励额外8枚金币
				<br /> 每月连续第28天签到，奖励额外10枚金币
				<br /> 3. 每日成就
				<br /> 当日分享任意视频，单条奖励1枚金币，每日上限10次
				<br /> 当日为任意视频点赞3次，奖励1枚金币，每日上限1次
				<br /> 4. 上传任务
				<br /> 当日成功上传（审核通过）短视频，单条奖励5枚金币，无上限
			</p>
			<p className={styles["title"]}>每日成就</p>
			<p className={styles["info"]}>
				当日分享任意视频，单条奖励1枚金币，每日上限10次
				<br /> 当日为任意视频点赞3次，奖励1枚金币，每日上限1次
			</p>
			<p className={styles["title"]}>上传任务</p>
			<p className={styles["info"]}>
				当日成功上传（审核通过）短视频，单条奖励5枚金币，无上限
  			</p>
			<p className={styles["title"]}>有象金币有什么用？</p>
			<p className={styles["info"]}>
				金币是有象世界中非常重要的物品，可以兑换意想不到的超值大礼
  			</p>
			<p className={styles["title"]}>签到规则</p>
			<p className={styles["info"]}>
				1. 的每日签到后可领取1枚金币
				<br /> 2. 连续签到天数越多，可获得的金币数越高
				<br /> 3. 每月连续第7天签到，奖励额外3枚金币
				<br /> 4. 每月连续第14天签到，奖励额外5枚金币
				<br /> 5. 每月连续第21天签到，奖励额外8枚金币
				<br /> 6. 每月连续第28天签到，奖励额外10枚金币
			</p>
		</div>
	)
};

export default AppScoreRule;

