import React from 'react';
import { connect } from 'dva';
// import { Icon, } from 'antd-mobile';
import moment from 'moment';
/* 页面独有组件 */
import LiveHeader from './component/liveHeader';
import LiveInfos from './component/liveInfos';
import VideoPlayer from 'components/videoPlayer';

/* 公共组件 */
// import JcAffix from 'components/jcAffix';
// import { Router, Route, Switch, Redirect } from 'dva/router';


import { LIVE_PAGE_IMG_URL, } from 'utils/imgUrl';
import { IMAGE_URL, VIDEO_URL } from 'utils/config';
import { getQuery, isArray } from 'utils/toolFunc';
import { history } from 'utils/history';
import { jumpApp } from 'utils/jump';
import styles from './index.less';

class LivePage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            time: {
                days: '00',
                hours: '00',
                mins: '00',
                secs: '00'
            }
        }
        this.dispatch = this.props.dispatch;
    }

    /* 跳转的 */
    gotoAppFun = () => {
        const { liveRoomId } = this.props.livePageM || {};
        jumpApp.openBrowserToAppOrDownload({ action: 'livePlay', liveRoomId });
    }
    /* 将毫秒变成年月月的 */
    fmtTime = (timeStamp) => {
        return moment(timeStamp).format('YYYY-MM-DD  HH:mm:ss');//YYY-MM-DD  HH:mm:ss 中间是两个空格
        /* ---------------------- 老方法 ----------------------*/
        // const date = new Date(timeStamp)
        // const year = date.getFullYear()
        // const month = date.getMonth() + 1
        // const day = date.getDate()
        // const hour = date.getHours()
        // const mins = date.getMinutes()
        // const secs = date.getSeconds()
        // return `${year}-${this.fixNum(month)}-${this.fixNum(day)}  ${this.fixNum(hour)}:${this.fixNum(mins)}:${this.fixNum(secs)}`
    }
    countdown(timeLeft) {
        const now = Date.now()
        if (now > timeLeft) {
            clearInterval(this.timer);
            return {
                days: '00',
                hours: '00',
                mins: '00',
                secs: '00'
            }
        };
        const timeLag = Math.floor((timeLeft - now) / 1000);
        const time = {
            days: this.fixNum(Math.floor(timeLag / 86400)),
            hours: this.fixNum(Math.floor((timeLag / 3600) % 24)),
            mins: this.fixNum(Math.floor((timeLag / 60) % 60)),
            secs: this.fixNum(Math.floor((timeLag % 60)))
        };
        this.setState({
            time
        });
    };
    /**
     * @desc 固定数字 'xx'
     * @param {any} num 
     * @returns 'xx'
     */
    fixNum(num) {
        if (num > 9) {
            return num
        } else {
            return `0${num}`
        }
    };

    componentWillReceiveProps = (nextProps) => {
        let { liveRoomData } = this.props.livePageM || {};
        let { scheduleTime } = liveRoomData || {};
        let { liveRoomData: n_liveRoomData } = nextProps.livePageM || {};
        let { scheduleTime: n_scheduleTime } = n_liveRoomData || {};
        /* 如果新的 scheduleTime 和 老的不一样， 则重新开始计时*/
        if (n_scheduleTime && n_scheduleTime !== scheduleTime) {
            this.beginScheduleTime(n_scheduleTime)
        }
    };
    componentDidMount = () => {
        // this.beginScheduleTime();
    }

    /* 秒表开始计时 */
    beginScheduleTime = (scheduleTime) => {
        clearInterval(this.timer);
        this.timer = setInterval(() => this.countdown(scheduleTime), 1000);
    }

    render() {
        const {
            warmUpVideoList = [], liveRoomData = {}, playbackUrl, playsInline = true, peopleWantLook, showTime, vOptions
        } = this.props.livePageM || {};

        const infoList = [
            {
                name: '活动详情',
                value: liveRoomData.detail
            }, {
                name: '活动地点',
                value: liveRoomData.location
            }, {
                name: '主办单位',
                value: liveRoomData.organizer
            }, {
                name: '合作单位',
                value: liveRoomData.partner
            },
        ];
        const {days, hours, mins, secs} = this.state.time;
        return (
            <div className={styles["wrap"]}>
                <LiveHeader gotoAppFun={this.gotoAppFun} logo={LIVE_PAGE_IMG_URL.livePageLogo} />
                {
                    !((liveRoomData.liveStatus == 1 && warmUpVideoList.length === 0) || (liveRoomData.liveStatus == 2 && (playbackUrl == "" || liveRoomData.playbackStatus == 0))) && <div className={styles["play-wrap"]}>
                        <VideoPlayer {...vOptions} />
                        {
                            liveRoomData.liveStatus === 0 && <div className={styles['status-text']}>
                                <i className={styles['icon-ing']}></i>
                                直播中
                            </div>
                        }
                        {
                            /* playbackStatus 回放状态 */
                            liveRoomData.liveStatus === 2 && !(playbackUrl == "" || liveRoomData.playbackStatus == 0) && (<div className={styles['status-text']}>
                                <i className={styles['icon-done']}></i>
                                回放
                            </div>)
                        }
                        <div className={styles["people"]}>
                            {peopleWantLook}
                        </div>
                    </div>
                }
                {
                    (liveRoomData.liveStatus == 1 && warmUpVideoList.length === 0) || (liveRoomData.liveStatus == 2 && (playbackUrl == "" || liveRoomData.playbackStatus == 0)) && (
                        <div className={styles['poster']} >
                            {liveRoomData.liveStatus == 2 && (playbackUrl == "" || liveRoomData.playbackStatus == 0) && (
                                <div className={styles["done"]}>当前直播已结束</div>
                            )}
                            < img src={`http://dx-image-test.itangchao.me/${liveRoomData.displayImageUrl}`} className={styles[(liveRoomData.liveStatus == 2 && (playbackUrl == "" || liveRoomData.playbackStatus == 0)) ? "cover" : ""]} />
                            <div className={styles["people"]}>
                                {peopleWantLook}
                            </div>
                        </div>
                    )
                }
                <div className={styles[liveRoomData.status < 4 ? 'status' : "status-ready"]}>
                    {
                        liveRoomData.status < 4 ? (
                            <div>
                                <h1> {liveRoomData.title}</h1>
                                <div className={styles["sub-title"]}>
                                    {liveRoomData.status == 1 ? "直播准备中" : "距离直播还有"}
                                </div>
                                <div className={styles["clock"]} >
                                    <div className={styles["days"]}>{days}天</div>
                                    <div className={styles["hours"]}>{hours}</div>
                                    <div className={styles["mins"]}>{mins}</div>
                                    <div className={styles["secs"]}>{secs}</div>
                                </div>
                            </div>
                        ) : (
                                <div>
                                    <h1>{liveRoomData.title}</h1>
                                    <span className={styles['sub']} > 开始时间：{this.fmtTime(liveRoomData.scheduleTime)}</span>
                                </div>
                            )
                    }
                </div >
                <LiveInfos infoList={infoList} />
            </ div >
        )
    }
}
export default connect(({ livePageM, commonM }) => ({ livePageM, commonM }))(LivePage);