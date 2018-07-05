import React from 'react';
import styles from './index.less';

function PersonTop({ avatar, nickName, focusNumber, fansNumber, gotoAppFun }) {

  return (
    <div className={styles["top-box"]}>
      <div className={styles["avatar"]} onClick={gotoAppFun}>
        <img src={avatar} alt="" />
      </div>
      <div className={styles["nickName"]} > {nickName}</div>
      <div className={styles["fans"]} >
        <div className={styles["fan"]}> 关注 < span > {focusNumber}</span></div>
        <div className={styles["fan"]}> 粉丝 < span > {fansNumber}</span></div >
      </div >
      <div className={styles["folllow-btn"]} onClick={gotoAppFun}>关注</div>
    </div >
  )
}

export default PersonTop;
