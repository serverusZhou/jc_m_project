import React from 'react';
import { connect } from 'dva';

import { NOT_FOUND_IMG_URL } from 'utils/imgUrl';
import { NOT_FOUND } from 'utils/constant';
import styles from './index.less';

function NotFound({ history }) {

    const goToIndex = () => {
        history.push(`index`);
    }
    return (
        <div className={styles["not-found-wrapper"]}>
            <div className={styles["not-found-innner"]}>
                <img className={styles["not-found-icon"]} src={NOT_FOUND_IMG_URL.notFoundPic} alt="" />
                <p className={styles["not-found-desc"]}>{NOT_FOUND.text}</p>
                <div className={styles["not-found-to-index"]} onClick={goToIndex}>{NOT_FOUND.toIndex}</div>
            </div>
        </div>
    );
}

NotFound.propTypes = {
};

export default connect()(NotFound);

