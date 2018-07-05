import React from 'react';
import { connect } from 'dva';

/* 页面独有组件 */
import DrawerNav from 'components/jcDrawerNav';
import VideoPlayer from 'components/videoPlayer';

import { PLAY_PAGE_IMG_URL, } from 'utils/imgUrl';
import { IMAGE_URL } from 'utils/config';
import { isArray } from 'utils/toolFunc';
import { jumpApp } from 'utils/jump';
import styles from './index.less';

class PlayPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            isShowVideoSummary: false,
            recommendFlag: false,
        };
        this.dispatch = this.props.dispatch;
    }

    /* 简介是否展示全 */
    showVideoSumaryToggle = () => {
        this.setState({ isShowVideoSummary: !this.state.isShowVideoSummary })
    }
    /* 跳转的 */
    gotoAppFun = () => {
        const { videoBaseId: videoId, videoDetailId } = this.props.playPageM || {};
        jumpApp.openBrowserToAppOrDownload({ action: 'videoPlay', videoId, videoDetailId });
    }
    /* 剧集切换 */
    gotoEpisode = (videoDetailId) => {
        const { url } = this.props.match || {};
        this.props.history.push(
            {
                pathname: `${url}`,
                search: `?videoDetailId=${videoDetailId}`,
                state: {
                    videoDetailId,
                },
            }
        );
    }

    videoItemOnclick = (videoBaseId, videoDetailId) => {
        this.props.history.push(
            {
                pathname: `/play/${videoBaseId}`,
                search: ``,
                state: { videoBaseId, videoDetailId }
            }
        )
    }
    render() {
        const { playPageM = {}, commonM = {} } = this.props;
        const {
            /* play相关 */
            recommendLists = [], episodes = [], videoInfos = {}, currEpisode,
            /* search相关 */
            searchContent, showSuggest, vOptions
        } = playPageM;
        const { channelList = [], suggestList = [] } = commonM;

        const {
            isShowVideoSummary,
            recommendFlag
        } = this.state;

        /* ---------------------------------- 上方搜素条 -------------------------------- */
        /**
         * * @param {string} searchContent 
         *  @todo 1.获取 关键词搜素模板建议词（suggestList）， 
         *          2 更新searchContent 和 展示搜索建议面板（showSuggest = true）
         *  */
        const getSuggestList = (searchContent = playPageM.searchContent) => {
            this.dispatch({ type: 'commonM/getSuggestList', payload: { searchContent } })
            this.dispatch({ type: 'playPageM/save', payload: { showSuggest: true, searchContent } })
        };

        /**
         * @todo 隐藏搜索建议面板（showSuggest = false
         */
        const hideSuggest = () => {
            this.dispatch({ type: 'playPageM/save', payload: { showSuggest: false } });
        };
        /* 抽屉 */
        const DrawerNavProps = {
            navList: channelList,
            showSearchBar: () => {
                getSuggestList();
            },
            SearchBarProps: {
                suggestList,
                // match,
                searchContent,
                showSuggest,
                inputClick: () => {
                    if (!showSuggest) {
                        getSuggestList();
                        // this.dispatch({ type: 'playPageM/save', payload: { showSuggest: true } });
                    }
                },
                inputOnChange: (e) => {
                    let searchContent = e.target ? e.target.value : '';
                    // this.dispatch({ type: 'playPageM/save', payload: { searchContent } });
                    getSuggestList(searchContent);
                },
                hideSuggest,
                clearInput: () => {
                    getSuggestList('');
                    // this.dispatch({type: 'playPageM/save', payload: {searchContent: '',}})
                },
                handleSearch: (searchContent) => {
                    /* 隐藏模板 */
                    hideSuggest();
                    /* if searchContent 的值 和当前搜索的keyWord 不一样则 跳转新的页面，else 不动 */
                    // if (searchContent || !showSuggest) {
                    if (searchContent) {
                        // const { url } = this.props.match || {};
                        /* 跳到新的页面，然后subscription 会listen history  */
                        this.props.history.push(
                            {
                                pathname: `/search`,
                                search: `?keyword=${searchContent}`,
                                state: {
                                    keyword: searchContent,
                                },
                            }
                        );
                        // this.dispatch({
                        //     type: 'playPageM/save', payload: {
                        //         searchContent: '', showSuggest: true
                        //     }
                        // })
                    }
                }
            },
            navOnClick: ({ id: channelId }) => {
                this.props.history.push({
                    pathname: `/index/${channelId}`,
                    state: {
                        channelId
                    }
                });
            }

        }
        /* 视频播放 */
        const VideoPlayerProps = {
            videoSourcesData: {
                data: vOptions ? vOptions.sources : undefined,
                type: vOptions ? vOptions.type : undefined,
            },
            autoplay: false,
            styles: {
                width: '100%',
                height: '100%'
            },
            poster: vOptions ? vOptions.poster : null,
        }

        /* ---------------------------------- 上方搜素条 -------------------------------- */
        /* 待优化 */
        return (
            <div className={styles["play"]}>
                <DrawerNav {...DrawerNavProps}>
                    {/* <div className={styles["player-wrap"]}> */}
                    <div className={styles["player-video-wrap"]}>
                        {
                            /* 当他有视频时,在,否则初始化时,没视频,会先出现空白, */
                            (VideoPlayerProps.videoSourcesData && VideoPlayerProps.videoSourcesData.data) && <VideoPlayer {...VideoPlayerProps} />
                        }
                    </div >
                    <button className={styles["jump-app"]} onClick={this.gotoAppFun}> 看高清完整版，安装有象视频</button >
                    <div className={styles["video-info"]}>
                        <label>{videoInfos.name}</label>
                        <i className={"iconfont icon-back " + (isShowVideoSummary ? (styles["upside"]) : '')}
                            onClick={this.showVideoSumaryToggle}
                        ></i>
                        <div className={styles["video-actor"]} > 演员：<span>{videoInfos.actor}</span></div>
                        {isShowVideoSummary && <div className={styles["video-summary"]}>简介：<span>{videoInfos.intro}</span></div>}
                    </div >
                    {
                        videoInfos.categories === 2 && (
                            <div className={styles["episode-area"]}>
                                <label>剧集</label>
                                <span className={styles["episode-display"]} > {(videoInfos && videoInfos.extMap) ? videoInfos.extMap.updateEpisode : null}</span>
                                {
                                    videoInfos.bizType === 1 && (
                                        <div className={styles["episode-wrap"]} ref={(node) => this.episodesTV = node} style={{ height: .75 + 'rem', overflow: 'hidden' }}>
                                            <ul style={{ height: .85 + 'rem', overflowY: 'hidden' }}>
                                                {
                                                    /* 关于 currEpisode 的作用 和意义，参考palyPageM的注释 */
                                                    isArray(episodes) && episodes.map((episode, key) => {
                                                        return (
                                                            <li key={key} className={styles[episode.episodeDisplay === currEpisode ? "episode-active" : "episode-tv"]}
                                                                onClick={
                                                                    () => {
                                                                        if (episode.episodeDisplay !== currEpisode) {
                                                                            this.gotoEpisode(episode.videoDetailId)
                                                                        }
                                                                    }
                                                                }
                                                            >
                                                                {
                                                                    episode.episodeDisplay === currEpisode ? (<img src={PLAY_PAGE_IMG_URL.palyActiveImgUrl} alt="" />) :
                                                                        <span>{episode.episodeDisplay}</span>
                                                                }
                                                            </li>
                                                        )
                                                    })
                                                }

                                            </ul>
                                        </div >
                                    )
                                }
                                {
                                    /* bizType  === 2 是综艺 */
                                    (episodes.length > 0 && videoInfos.bizType === 2) && (
                                        <div className={styles["episode-wrap"]} ref={(node) => this.episodesVariety = node} style={{ height: 1.23 + 'rem', overflow: 'hidden', }}>
                                            <ul style={{ height: 1.33 + 'rem', overflowY: 'hidden' }}>
                                                {
                                                    /* 关于 currEpisode 的作用 和意义，参考palyPageM的注释 */
                                                    isArray(episodes) && episodes.map((episode, key) => {

                                                        return (<li key={key} className={styles["episode-variety"] + (episode.episodeDisplay === currEpisode ? ' ' + styles["episode-variety-active"] : '')}
                                                            onClick={episode.episodeDisplay === currEpisode ? null : () => this.gotoEpisode(episode.videoDetailId)}
                                                        >
                                                            <div className={styles["episode-variety-img"]} >
                                                                <img src={IMAGE_URL + episode.images[0].url} alt="" />
                                                                <span>{episode.episodeDisplay}</span>
                                                            </div>
                                                            <p>{episode.title}</p>
                                                        </li>)
                                                    })
                                                }

                                            </ul>
                                        </div >
                                    )
                                }
                            </div >
                        )
                    }
                    <div className={styles["recommend-area"]} >
                        <label className={styles["recommend-title"]}> 精彩推荐</ label>
                        {
                            isArray(recommendLists, true) && (
                                <div className={styles["recommend-wrap"]}>
                                    <ul className={styles[videoInfos.categories === 1 ? "recommend-list" : "recommend-episode-list"]}>
                                        {
                                            recommendLists.map((item, key) => {
                                                return (
                                                    <li onClick={() => { this.videoItemOnclick(item.videoBaseId) }} key={key}>
                                                        <img src={IMAGE_URL + item.imgUrl} alt="" />
                                                        {item.extMap.updateEpisode && <span>{item.extMap.updateEpisode}</span>}
                                                        <p>{item.name}</p>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                            )
                        }
                        {
                            (isArray(recommendLists) && recommendLists.length === 0 && recommendFlag) && <div className={styles["recommend-none"]}>暂无推荐视频</div>
                        }
                    </div>
                    {/* </div> */}
                </DrawerNav>
            </div >
        )
    }
}

export default connect(({ playPageM, commonM }) => ({ playPageM, commonM }))(PlayPage);