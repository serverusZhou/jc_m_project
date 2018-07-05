import React, { Component } from 'react';
import { connect } from 'dva';

import HotRecommand from './component/hotRecommand'; //热门推荐
import HeaderBox from './component/headerBox'; //用户头像信息 固定在头部
import VideoNoExist from './component/videoNoExist'; //视频不存在
import VideoPlayerBox from './component/videoPlayerBox'; //视频不存在

import { handleImgUrl } from 'utils/toolFunc';
import { SHORT_VIDEO_IMG_URL, COMMON_IMG_URL } from 'utils/imgUrl';
import { jumpApp } from 'utils/jump';

import styles from './index.less';

class ShortVideo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            bytesCount: 0,
        }
    }
    /* 去app */
    gotoAppFun = (id) => {
        if (id === undefined || id === null) {
            id = this.props.shortVideoM ? this.props.shortVideoM.id : '';
        }
        jumpApp.openBrowserToAppOrDownload({ action: 'shortVideo', id });
    }

    render() {
        const {
            bytesCount,//字数
            deleteStatus,//是否已经删除
            nickName,//昵称
            shareTitle,//分享的title
            likeCount,//喜欢数
            shareCount,//分享数
            introduction,//介绍
            vOptions,
            hotRecommandvideoList,
            avatar,
            // poster,
        } = this.props.shortVideoM || {};
        const playerBoxHeight = document.body.clientHeight + 'px';

        const HeaderBoxProps = {
            avatarImgSrc: handleImgUrl(avatar) || COMMON_IMG_URL.defaultUserInfoAvatarImgUrl,//头像地址
            nickName, // 昵称
            gotoAppFun: this.gotoAppFun
        };

        const HotRecommandProps = {
            hotRecommandvideoList,//推荐列表
            gotoAppFun: this.gotoAppFun
        };

        const VideoNoExistProps = {
            errImgUrl: SHORT_VIDEO_IMG_URL.errImgUrl, //视频不存在的图片地址
        };
        /* 搬过来的。下面各个啥意思，可以通过在哪里用的反猜 */
        const VideoPlayerBoxProps = {
            videoJsOptions: {
                autoplay: false,
                controls: true,
                // controls: true,
                videoSourcesData: {
                    data: (vOptions && vOptions.sources instanceof Array) ? vOptions.sources.map((item, key) => {
                        return {
                            src: item.src,
                            // type: 'application/x-mpegURL',
                            type: 'video/mp4'
                        }
                    }) : [],
                },
                poster: vOptions.poster,
                // playState:this.state.playState
                // playState: 1,
            }, //videojs选项
            shareTitle,
            bytesCount,
            introduction,
            likeImgUrl: SHORT_VIDEO_IMG_URL.likeImgUrl,
            shareImgUrl: SHORT_VIDEO_IMG_URL.shareImgUrl,
            likeCount, shareCount,
            gotoAppFun: this.gotoAppFun
        };
        return (
            <div className={styles["short-video-box"]}>
                {/* 头部 fixed */}
                <HeaderBox {...HeaderBoxProps} />
                {/* 播放页面 */}
                <div className={styles["player-box"]} style={{ height: playerBoxHeight }}>
                    {
                        deleteStatus ? (
                            <VideoNoExist {...VideoNoExistProps} />
                        ) : (
                                <VideoPlayerBox {...VideoPlayerBoxProps} />
                            )
                    }
                </div >
                {/* 热门推荐 */}
                <HotRecommand {...HotRecommandProps} />
            </div >
        )
    }
}

export default connect(({ shortVideoM }) => ({ shortVideoM }))(ShortVideo)