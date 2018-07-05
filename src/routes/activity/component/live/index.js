import React, { Component } from 'react';
import styles from './index.less';
import VideoPlayer from 'components/videoPlayer';
import AnimationNum from '../animationNum';
import { IMAGE_URL } from 'utils/config';
import cn from 'classnames';

class Live extends Component {
  constructor(props) {
    super(props);
    this.state = {
      likeClicked: false, //是否点击过我也想看,
      alertInfoStatus: false
    }
    this.timer = null;
    this.timerMetas = null;
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.currentTab !== nextProps.currentTab) {
      clearInterval(this.timer);
      this.intervalLiveTime(nextProps);
      clearInterval(this.timerMetas);
      this.intervalStatus();
    }
  }
  likeClick = () => {
    const { likeClicked, alertInfoStatus } = this.state;
    if (likeClicked) {
      if (alertInfoStatus === false) {
        this.setState({
          alertInfoStatus: true
        })
        let timer = setTimeout(() => {
          this.setState({
            alertInfoStatus: false
          });
          clearTimeout(timer);
          timer = null;
        }, 2000);
      }
      return;
    }
    this.setState({
      likeClicked: true
    });
  }
  // 直播前的倒计时
  intervalLiveTime = (nextProps) => {
    const { curLiveRoomscheduleTime } = nextProps;
    this.timer = setInterval(() => {
      if (!this.span) return;
      this.span.innerText = getRestTime(curLiveRoomscheduleTime);
    }, 1000);
  }
  // 间隔10s获取直播间的统计信息
  intervalStatus = () => {
    let { dispatch } = this.props;
    this.timerMetas = setInterval(() => {
      dispatch({
        type: 'activityM/getLiveRoomMetas'
      });
    }, 10000);
  }
  render() {
    let { vOptions, likeNum, watchedNum, watchingNum, curLiveRoomStatus, headImgMweb } = this.props;
    let { likeClicked, alertInfoStatus } = this.state;
    likeNum = likeNum ? likeNum.toString() : '';
    watchedNum = watchedNum ? watchedNum.toString() : '';
    watchingNum = watchingNum ? watchingNum.toString() : '';
    const likeClass = cn(
      styles['likeBtn'],
      {
        [styles['clicked']]: likeClicked
      }
    );
    const infoClass = cn(
      styles['alertInfo'],
      {
        [styles['show-info']]: alertInfoStatus
      }
    );
    const isShowTimeBefore = curLiveRoomStatus === 1;
    let num;
    switch (curLiveRoomStatus) {
      case 0: num = watchingNum; break;
      case 1: num = likeNum; break;
      case 2: num = watchedNum; break;
      default: break;
    }
    return (
      <div className={styles["wrap"]}>
        <div className={styles["live-player"]} style={{ background: `url(${IMAGE_URL + headImgMweb}) no-repeat` }}>
          {
            isShowTimeBefore &&
            <div className={styles["live-left-time"]}>
              <span>距直播开始: </span>
              <span className={styles["LCDMono"]} ref={node => { this.span = node; }}></span>
            </div>
          }
          {
            <div className={styles["player-box"]}>
              <VideoPlayer {...vOptions} />
            </div>
          }
        </div>
        <div className={styles["likeWatch"]}>
          <div>
            <div className={styles["likeNum"]}>
              {
                <AnimationNum numberStr={num} />
              }
            </div>
            {
              curLiveRoomStatus === 1 &&
              <div>
                <div className={styles["text"]}> 人想看</div>
                <div onClick={this.likeClick} className={likeClass}>
                  <div className={styles["icon"]}></div>
                  <div className={styles["info"]}>我也想看</div>
                  <div className={infoClass}>
                    <span>您已加入想看队伍了哦</span>
                  </div>
                </div>
              </div>
            }
            {
              curLiveRoomStatus === 0 &&
              <div className={styles["livePlaying"]}>
                <div>
                  <div className={styles["text"]}> 人在观看</div>
                  <div className={styles["live-time-status"]}>
                    <div className={styles["live-background"]}></div>
                    <div className={styles["info"]}>正在直播</div>
                  </div>
                </div>
              </div>
            }
            {
              curLiveRoomStatus === 2 &&
              <div className={styles["live-off"]}>
                <div>
                  <div className={styles["text"]}> 人观看过</div>
                </div>
              </div>
            }
          </div>
        </div>

      </div>
    );
  }
}

export default Live;


/**
 * 获取距离直播时间
 * @param {string} timeLeft 时间
 */

const getRestTime = timeLeft => {
  let timeFormat;
  let restSeconds = ~~((parseInt(timeLeft, 10) - Date.now()) / 1000);
  if (restSeconds <= 0) {
    timeFormat = {
      days: '0',
      hours: '00',
      mins: '00',
      secs: '00'
    };
  } else {
    timeFormat = {
      days: ~~(restSeconds / 86400),
      hours: padstart(~~((restSeconds / 3600) % 24), 2),
      mins: padstart(~~((restSeconds / 60) % 60), 2),
      secs: padstart(~~(restSeconds % 60), 2)
    };
  }
  return timeFormat.days + '天 ' + timeFormat.hours + ':' + timeFormat.mins + ':' + timeFormat.secs;
};

const padstart = (num, len) => {
  let str = '0000000000';
  return (str + num).slice(-len);
}