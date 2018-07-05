/**
 * @author GP
 * @data 2018.5.10
 * @email gengpeng@jcgroup.com.cn
 * @desc 个人分享职业
 */
import React, { Component } from 'react';
import { connect } from 'dva';

import ErrorInPage from 'components/errorInPage';

import AboutMe from './component/aboutMe';
import Dynamics from './component/dynamics';
import MyViewList from './component/myViewList';
import PersonTop from './component/personTop';

import { COMMON_IMG_URL, } from 'utils/imgUrl';
import { isArray } from 'utils/toolFunc.js';
import styles from './index.less';
// import { history } from 'utils/history';
import { jumpApp, gotoNotFound } from 'utils/jump';

const ERROR_TIP_TEXT = {
    myViewList: '还没有我拍记录哦，赶快去拍摄上传吧…',
    dynamics: '暂无动态记录哦…'
};
const TAB_TITLE_ITEM = [
    {
        name: '我拍',
        id: 0,
    }, {
        name: '动态',
        id: 1,
    }, {
        name: '关于我',
        id: 2,
    },
];
const TO_APP_TEXT = '去TA的个人主页';

class PersonPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            //tabItem 的样式
            styleTabItems: {
                left: '-0%',
                position: 'absolute'
            },
            tabActiveKey: 0, //  tabs 活动id
        };
        this.dispatch = this.props.dispatch;
    }

    /*  */
    tabOnChange = (tabActiveKey) => {
        this.setState({
            styleTabItems: {
                ...this.state.styleTabItems,
                left: `-${tabActiveKey * 100}%`,
            },
            tabActiveKey
        })
    }
    gotoAppFun = () => {
        const { userInfoData = {}, } = this.props.personPageM || {};
        let { uid = '' } = userInfoData;
        if (uid) {
            jumpApp.openBrowserToAppOrDownload({ action: 'personPage', uid });
        }
    }
    goToVideo = (item) => {
        const { history } = this.props;
        history.push(
            {
                pathname: `shortVideo/${item.id}`,
                // search: `?videoDetailId=${videoDetailId}`,
                state: {
                    videoId: item.id
                },
            }
        );
    }

    scroll = (type, e) => {
        const { scrollTop, offsetHeight, scrollHeight } = e.target || {};
        if (scrollTop !== undefined && offsetHeight !== undefined && scrollHeight !== undefined) {
            if (scrollTop + offsetHeight + 80 > scrollHeight) {
                if (type === 'dynamics') {
                    this.dispatch({
                        type: 'personPageM/FETCH_DYNAMICS_LIST', payload: {
                            // shareToken,
                            errorCallBack: gotoNotFound
                        }
                    });
                } else if (type === 'myViewList') {
                    this.dispatch({
                        type: 'personPageM/FETCH_MY_VIEW_LIST', payload: {
                            // shareToken,
                            errorCallBack: gotoNotFound
                        }
                    });
                } else { }
                // }
            }
        }
    }

    componentDidMount = () => {
    }

    render() {
        const { userInfoData = {}, myViewList, dynamicsList, myViewListLength } = this.props.personPageM || {};

        const {
            tabActiveKey, styleTabItems
        } = this.state;

        /* 给头像个默认的 */
        let _avatar = userInfoData.avatar || COMMON_IMG_URL.defaultUserInfoAvatarImgUrl;
        const PersonTopProps = {
            gotoAppFun: this.gotoAppFun,
            avatar: _avatar,
            nickName: userInfoData.nickName,
            focusNumber: userInfoData.focusNumber,
            fansNumber: userInfoData.fansNumber,
        }
        return userInfoData ? (
            <div className={styles["person-page"]}>
                {
                    <PersonTop {...PersonTopProps} />
                }

                <div className={styles["bottom-box"]} >
                    <div className={styles["tabs-box"]} >
                        <div className={styles["tabs-title-box"]} >
                            {
                                isArray(TAB_TITLE_ITEM, true) && TAB_TITLE_ITEM.map((item, key) => (
                                    <div key={key} onClick={() => this.tabOnChange(key)} className={styles[key === tabActiveKey ? 'tabs-title-active' : 'tabs-title']} >
                                        {item.name}
                                    </ div>
                                ))
                            }
                        </div>
                        <div className={styles["tabs-content-box"]} >
                            <div className={styles["tab-items"]} style={styleTabItems}>
                                <div onClick={() => { this.tabOnChange(0) }} className={styles["tab-item"]}>
                                    {
                                        isArray(myViewList, true) ? (
                                            <MyViewList myViewListLength={myViewListLength} myViewList={myViewList} goToVideo={this.goToVideo} scroll={this.scroll} />
                                        ) : (<ErrorInPage errorTipText={ERROR_TIP_TEXT.myViewList} />)
                                    }
                                </div>
                                <div onClick={() => { this.tabOnChange(1) }} className={styles["tab-item"]}>
                                    {
                                        isArray(dynamicsList, true) ? (
                                            <Dynamics dynamicsList={dynamicsList} avatar={_avatar} nickName={userInfoData.nickName} scroll={this.scroll} />
                                        ) : (<ErrorInPage errorTipText={ERROR_TIP_TEXT.dynamics} />)
                                    }
                                </div>
                                <div onClick={() => { this.tabOnChange(2) }} className={styles["tab-item"]}>
                                    {
                                        isArray(userInfoData.personInfoList, true) && (
                                            <AboutMe personInfoList={userInfoData.personInfoList} />
                                        )
                                    }
                                </div>
                            </ div >
                        </div >
                    </ div >
                    <div className={styles["btn-box"]} >
                        <div className={styles["btn"]} onClick={this.gotoAppFun}>{TO_APP_TEXT}</div>
                    </ div >
                </div >
            </ div >
        ) : null
    }
}

export default connect(({ personPageM }) => ({ personPageM }))(PersonPage);


