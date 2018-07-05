import React from 'react';
import styles from './index.less'

function NoResult({ noMovieImgUrl }) {
    return (
        <div className={styles["no-result-wrapper"]}>
            <section className={styles["no-result"]}>
                <img src={noMovieImgUrl} alt='' />
                <p>暂时没有相关影片哦</p>
            </section>
            <h2>热门推荐</h2>
        </div>
    )
}

export default NoResult;
