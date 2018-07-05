import React from 'react';
import { connect } from 'dva';

import styles from './index.less';
import { isArray } from 'utils/toolFunc';
import { Accordion } from 'antd-mobile';

const Help = ({ htmlPagesM }) => {
    let { QAlist } = htmlPagesM;
    return (
        <div className={styles["help-container"]}>
            <Accordion accordion openAnimation={{}} className="my-accordion" onChange={this.onChange}>
                {
                    isArray(QAlist) && QAlist.map((item) => {
                        return (
                            <Accordion.Panel header={item.question}>
                                <div className={styles["answer"]}>{item.answer}</div>
                            </Accordion.Panel>)

                    })
                }
            </Accordion>
        </div>
    )
};
export default connect(({ htmlPagesM }) => ({ htmlPagesM }))(Help);