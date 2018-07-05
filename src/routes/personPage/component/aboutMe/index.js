import React from 'react';
import styles from './index.less';
import { isArray } from 'utils/toolFunc.js';
import PropTypes from 'prop-types';

function AboutMe({ personInfoList, ...props }) {
  return (
    <div className={styles["about-me"]}>
      {
        personInfoList.map((personInfo, key) => (<div className={styles["panel"]} key={key}>
          <div className={styles["title"]} > {personInfo.title}</div>
          {
            isArray(personInfo.rowList) && personInfo.rowList.map((row, key2) => (
              <div className={styles["row"]} key={key2}>
                {row.label && <div className={styles["label"]} > {row.label}：</div>}
                <div className={styles["text"]} > {row.text}</ div >
              </div >
            ))
          }
        </div >
        ))
      }
    </div >
  )
}
AboutMe.propTypes = {
  personInfoList: PropTypes.arrayOf({
    rowList: PropTypes.isArray
  }).isRequired
};
export default AboutMe;
