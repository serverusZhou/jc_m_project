import React from 'react';
import styles from './index.less';


function ErrorInPage({ errorTipText, }) {
  return (
    <div className={styles["error-box"]}>
      <div className={styles["error-img"]}>
      </div>
      <div className={styles["text"]}>
        {errorTipText}
      </div>
    </div>
  )
}

export default ErrorInPage;
