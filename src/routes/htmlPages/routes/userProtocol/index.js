import React from 'react';
import styles from './index.less';
import { isArray } from 'utils/toolFunc';
import { userProtocolTitle, userProtocolIntro, userProtocolList, } from './data';


const UserProtocol = () => {
    const recursive = (userProtocolList, level = 0) => {
        return userProtocolList.map((item, key) => {
            return <div>
                <p>{`${(level ? level + '.' : '')}${(key + 1)}${item.title}`}</p>
                {
                    isArray(item.children) && recursive(item.children, `${(level ? level + '.' : '')}${(key + 1)}`)
                }
            </div>
        })
    }
    return (
        <div className={styles["userProtocol-container"]}>
            <h1 className={styles["title"]}>{userProtocolTitle}</h1>
            <p className={styles["intro"]}>{userProtocolIntro}</p>
            {
                isArray(userProtocolList) && recursive(userProtocolList)
            }
        </div>
    )
};

export default UserProtocol;