import React from 'react';
import styles from './index.less';
import { isArray } from 'utils/toolFunc';
import { blockList, columns } from './data';

const Intro = () => {
    return (
        <div className={styles["intro-container"]}>
            {
                isArray(blockList) && blockList.map((item, key) => {
                    return (
                        <div className={styles["block"]} key={key}>
                            <h1 className={styles["title"]}>{item.title}<span>[{item.subTitle}]</span></h1>
                            {
                                isArray(item.contentList) && item.contentList.map((item, key) => {
                                    return <div className={styles["content"]}>
                                        {item.title && <ul><li>{item.title}</li></ul>}
                                        {
                                            isArray(item.contentList) ? item.contentList.map((item, key) =>
                                                <p>{item}</p>
                                            ) : <p> {item.content}</p>
                                        }
                                        {
                                            isArray(item.tableList, true) && item.tableList.map((item, key) =>
                                                < div className={styles["table-container"]}>
                                                    <table>
                                                        <caption>{item.caption}</caption>
                                                        {
                                                            columns.map((column, key) => {
                                                                return <tr key={key}>
                                                                    <td width="50%">{column.name}</td>
                                                                    <td>{item.data[column.key]}</td>
                                                                </tr>
                                                            })
                                                        }
                                                    </table>
                                                </div>
                                            )

                                        }
                                    </div>
                                })
                            }
                        </div>
                    )
                })
            }
        </div>
    )
};

export default Intro;