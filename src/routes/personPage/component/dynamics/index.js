import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.less';

function Dynamics({ avatar, nickName, dynamicsList, scroll }) {

  return (
    <div className={styles["dynamics"]} onScroll={(e) => { typeof (scroll) === 'function' && scroll('dynamics', e) }}>
      {
        dynamicsList.map((item, key) => {
          return (<div className={styles["row"]} key={key}>
            <div className={styles["leftBox"]}>
              {
                <img src={avatar} alt="" />
              }
            </div>
            <div className={styles["rightBox"]}>
              <div className={styles["nickName"]}>{nickName}</div>
              <div className={styles["gmtCreated"]}>{item.gmtCreated}</div>
              <div className={styles["actionName"]}>{item.actionName}</div>
            </div>
          </div>
          )
        })
      }

    </div >
  )
}

Dynamics.propTypes = {
  avatar: PropTypes.string.isRequired,
  nickName: PropTypes.string,
  dynamicsList: PropTypes.arrayOf({}).isRequired,
  scroll: PropTypes.func,
};

export default Dynamics;
