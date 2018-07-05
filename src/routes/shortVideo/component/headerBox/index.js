import React from 'react';
import styles from './index.less';
// const shortVideoHotRecomandTitle = '—— 今日热门推荐 ——';

const HeaderBox = (props) => {
  const { nickName, avatarImgSrc, gotoAppFun } = props;
  const TEXT = '用有象，邀你在一起';
  const BTN_TEXT = '看看TA的故事';
  return (
    <div className={styles["headerBox"]}>
      <div className={styles["avatar"]}>
        {/* <img v-lazy="avatar" /> */}
        <img src={avatarImgSrc} alt={''} />
      </div>
      <div className={styles["nickName"]}>
        <p className={styles["nick"]}>{nickName}</p>
        <p className={styles["text"]}>{TEXT}</p>
      </div>
      <div className={styles["gotoApp"]} onClick={typeof (gotoAppFun) === 'function' ? gotoAppFun : () => { }}>
        {BTN_TEXT}
      </div>
    </div>
  )
}

export default HeaderBox