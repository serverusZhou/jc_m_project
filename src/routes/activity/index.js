import React from 'react';
import { connect } from 'dva';
import { Link } from 'react-router-dom';
// import { Flex, WhiteSpace } from 'antd-mobile';
import cn from 'classnames';
/* 页面独有组件 */
import Swiper from 'components/swiper';
import Advertising from './component/advertising';
import ActiveLoading from './component/activeLoading';
import FootTemeplate from './component/footTemeplate';
import CardTitle from './component/cardTitle';
import Live from './component/live';
import GoHome from './component/goHome';
import FixBottom from './component/fixBottom';
import { ACTIVE_IMG_URL } from 'utils/imgUrl';
import { IMAGE_URL, } from 'utils/config';
import { isArray, handleImgUrl } from 'utils/toolFunc';

import styles from './index.less';

const { activeLoading, activeDefaultElephantImgUrl } = ACTIVE_IMG_URL;
class Activity extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            foldStatus: false,
            showFooter: true,
            isPageLoaded: false,
            headerImageLoaded: false,
        };
        this.dispatch = this.props.dispatch;
        this.intervalCountTimer = null;
    }

    componentDidMount = () => {
    }

    /* 是否展开说明 */
    handleFold = () => {
        this.setState((prevState) => ({
            foldStatus: !prevState.foldStatus
        }));
    }

    // 关闭底导
    handleCloseFooter = () => {
        this.setState({
            showFooter: false
        })
    }

    isPageLoaded = () => {
        this.setState({
            isPageLoaded: true
        });
    }

    /**
     * @param mdata mdata 包含videos 的数据
     * @param colClassName mdata 包含单个video的样式 noRequire
     * @param row 一行放几个
     * @param col 一列放几个
     * @param videoJudge 筛选条件
     * @memberof Activity
     */
    videoLoop = ({ mdata = {}, colClassName, row = 1, col = 1, videoJudge } = {}) => {
        let { videos } = mdata || {};
        if (!isArray(videos, true)) {
            return null;
        }
        if (typeof (videoJudge) === 'function') {
            videos = videos.filter((item) => videoJudge(item))
        }
        let loops = [];
        for (let i = 0; i < videos.length; i = row * col + i) {
            let rowEls = [];
            for (let rIndex = 0; rIndex < row; rIndex++) {
                let colEls = [];
                for (let cIndex = 0; (cIndex < col && (rIndex * col + cIndex + i) < videos.length); cIndex++) {
                    const video = videos[rIndex * col + cIndex + i];
                    const innerJsx = <div>
                        <img src={handleImgUrl(video.imageUrl) || activeDefaultElephantImgUrl} alt="" key={0} />
                        <div className={styles["video-content"]}>
                            {
                                video.name !== null && video.name.trim() !== '' && <p className={styles["name"]} key={1}>{video.name}</p>
                            }
                            {
                                video.subName !== null && video.subName.trim() !== '' && <p className={styles["subname"]} key={2}>{video.subName || ''}</p>
                            }
                        </div>
                    </div>
                    colEls.push(<div className={colClassName || styles['col']} key={cIndex}>
                        {
                            (!video.url && !video.videoId) && <a>
                                {innerJsx}
                            </a>
                        }
                        {
                            video.url && <a href={video.url} >
                                {innerJsx}
                            </a>
                        }
                        {
                            (!video.url && video.videoId) && <Link to={{ name: 'Play', params: { videoBaseId: video.videoId } }} style={{ display: 'inline-block', position: 'relative' }}>
                                {innerJsx}
                            </Link>
                        }
                    </div>);

                };
                rowEls.push(<div className={styles['row']}>{colEls}</div>);
            }
            let loop = <div key={i} className={styles["videoBox"]}>
                {rowEls}
            </div>;
            loops.push(
                loop
            )
        };
        return loops;
    }

    render() {
        const {
            isPageLoaded, foldStatus, showFooter
        } = this.state;

        const { curLiveRoomStatus, channelInfo = {}, tabs = [], models = [], vOptions, likeNum, watchingNum, watchedNum, curLiveRoomscheduleTime, currentTab } = this.props.activityM || {};
        const { dispatch } = this.props;
        const { headImgMweb } = channelInfo;
        const FootTemeplateProps = {
            footType: channelInfo.footType,
            footImgSrc: handleImgUrl(channelInfo.footImgMweb) || activeDefaultElephantImgUrl
        }
        const foldClass = cn(
            styles['more'],
            {
                [styles['is-click']]: foldStatus
            }
        )
        const liveProps = {
            dispatch,
            headImgMweb,
            curLiveRoomStatus,
            curLiveRoomscheduleTime,
            currentTab,
            vOptions,
            likeNum,
            watchingNum,
            watchedNum
        }
        return (
            <div className={styles[channelInfo.type === 1 ? "annual-meeting-wrap" : "wrap"]} >
                <ActiveLoading isPageLoaded={isPageLoaded} />
                {
                    /* <!-- 直播专题模板 --> channelInfo.type 1 是启用年会模板*/
                    channelInfo.type !== 1 && (
                        <div>
                            <div className={styles["bgWrap"]} style={{ background: channelInfo.backType === 0 && channelInfo.backMweb ? 'url(' + IMAGE_URL + channelInfo.backMweb + ') repeat' : channelInfo.backMweb }}>
                                <Live {...liveProps} />
                                {
                                    tabs.length && (
                                        <div className={styles["live"]}>
                                            {
                                                tabs.length > 1 && <ul className={styles["signals"]}>
                                                    {
                                                        isArray(tabs) && tabs.map((item, index) => (
                                                            index < 4 ? <li onClick={() => dispatch({ type: 'activityM/changeLiveRoom', payload: { index } })} key={index}>
                                                                <span className={item.iscur ? styles['is-active'] : ''}>{item.title}</span>
                                                            </li> : null
                                                        ))
                                                    }
                                                </ul>
                                            }
                                            <div className={styles["desc"]}>
                                                {
                                                    isArray(tabs) && tabs.map((item, index) => (
                                                        <div key={index} className={styles[item.iscur ? 'is-active' : '']}>
                                                            {
                                                                (foldStatus || item.desc.length < 90)
                                                                    ? <div dangerouslySetInnerHTML={{ __html: item.desc }} />
                                                                    : <div dangerouslySetInnerHTML={{ __html: item.intro }} />
                                                            }
                                                            {
                                                                (item.desc.length > 90 && item.iscur) &&
                                                                <div className={foldClass} onClick={this.handleFold}>
                                                                    <span> {foldStatus ? '收起' : '展开'}</span>
                                                                    <i></i>
                                                                </div>
                                                            }

                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    )
                                }
                                {
                                    isArray(models) && models.map(({ cardType, cardName, layoutId, mdata, titleStyleType, ...item }, index) => {
                                        const _getCardTitleProps = () => ({
                                            titleStyleType,
                                            cardName,
                                            cardTitleImgSrc: handleImgUrl(item[item.multiply ? "imgTitleStyleUrlM2" : "imgTitleStyleUrlM"]) || activeDefaultElephantImgUrl
                                        });
                                        let rtn = '';
                                        if (cardType === 1) {
                                        } else if (cardType === 2) {
                                            /* 卡片 */
                                            const commonRtn = <CardTitle {..._getCardTitleProps()} />;
                                            if (layoutId === 1) {
                                            } else if (layoutId === 2) {
                                                let col = 2, row = 2;
                                                rtn = [
                                                    <Swiper slideMore={mdata.videos.length > col * row} >
                                                        {
                                                            this.videoLoop({
                                                                mdata, col, row,
                                                                colClassName: styles['col-2']
                                                            })
                                                        }
                                                    </Swiper>,
                                                ];
                                            } else if ([3, 4, 6].indexOf(layoutId) !== -1) {
                                                let col = 2, row = 3;
                                                rtn = [
                                                    <Swiper slideMore={mdata.videos.length > col * row} >
                                                        {
                                                            this.videoLoop({
                                                                mdata, col, row,
                                                                colClassName: styles['col-2']
                                                            })
                                                        }
                                                    </Swiper>,
                                                ];

                                            } else if (layoutId === 5) {
                                                let col = 2, row = 1;
                                                rtn = [
                                                    <Swiper slideMore={mdata.videos.length > col * row} >
                                                        {
                                                            this.videoLoop({
                                                                mdata, col, row,
                                                                colClassName: styles['col-2'] + ' ' + styles['col-v'],
                                                            })
                                                        }
                                                    </Swiper>,
                                                ];

                                            } else if (layoutId === 7) {
                                                /* <!-- 点播：模板1+2x2 --> */
                                                /* <!-- 大视频轮播 --> */
                                                rtn = [
                                                    <Swiper slideMore={false} isPagination={true} isAuto>
                                                        {
                                                            this.videoLoop({
                                                                mdata,
                                                                colClassName: styles['col-v'],
                                                                videoJudge: (video) => {
                                                                    // console.log(video);
                                                                    return video.type === 0
                                                                }
                                                            })
                                                        }
                                                    </Swiper>,
                                                    /* <!-- 小视频2x2 --> */
                                                    <Swiper slideMore={false}>
                                                        {
                                                            this.videoLoop({
                                                                mdata,
                                                                videoJudge: (video) => video.type === 1,
                                                                colClassName: styles['col-2'],
                                                                col: 2,
                                                                row: 2
                                                            })
                                                        }
                                                    </Swiper>,
                                                ]
                                            } else {
                                            }
                                            // 点播卡片3x2+3x2模板需要两张图，左边用imgButtomStyleUrlM, 右边用imgButttomStyleM2
                                            let videosBackgroundImageStyle = null;
                                            if (item.buttomStyleType === 0) {
                                                const backgroundImage = item.multiply ? item.imgButtomStyleUrlM2 : item.imgButtomStyleUrlM;
                                                videosBackgroundImageStyle = {
                                                    background: `url(${handleImgUrl(backgroundImage)}) no-repeat center center`
                                                };
                                            }
                                            return rtn ?
                                                <div key={index}>
                                                    {commonRtn}
                                                    <div className={styles["model-box"]} style={videosBackgroundImageStyle}>
                                                        {rtn}
                                                    </div>
                                                </div> : null
                                        } else if (cardType === 3) {
                                            /* 广告 */
                                            return (mdata[0] && mdata[0].imageUrl)
                                                ? <div key={index}> <Advertising mdata={mdata} /> </div>
                                                : null;
                                        } else { }
                                        return null;
                                        // }).filter(item=>item)
                                    })
                                }
                                <FootTemeplate {...FootTemeplateProps} />
                            </div >
                        </div >
                    )
                }
                <GoHome show={showFooter} />
                <FixBottom show={showFooter} onClose={this.handleCloseFooter} />
                <img onLoad={this.isPageLoaded} src={activeLoading} alt="" style={{ display: 'none' }} />
            </div >
        )
    }
}

export default connect(({ activityM, commonM }) => ({ activityM, commonM }))(Activity);