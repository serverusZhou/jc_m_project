// import addEventListener from 'rc-util/lib/Dom/addEventListener';
import React, { Component } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-flash';
import 'videojs-contrib-hls';
/* 清晰度切换 */
import './lib/videojs-resolution-switcher';

import { SHORT_VIDEO_IMG_URL, PLAY_PAGE_IMG_URL } from 'utils/imgUrl';
import { handleVideoUrl, isArray, omit, deepEuqal } from 'utils/toolFunc';
import styles from './index.less';

const m3u8Parser = require('m3u8-parser');

const PLAY_QUALITY = ['流畅', '标清', '高清', '1080P'];
const ERROR_DISPLAY_INNER_HTML = `<div class="content-wrap"><p class="error-text">加载失败，请检查网络设置</p><p class="error-reload"><i class="iconfont icon-refresh"></i>刷新重试</p></div>`;
const SPINNING_MODAL_INNER_HTML = `<div class="content-wrap"><img class="loading-gif" src="${PLAY_PAGE_IMG_URL.palyVideoPlayerLoading}" alt=""><p>加载中</p></div>`;
const PLAY_END_MODAL_INNER_HTML = `<div class="content-wrap"><span class="end-text">视频播放已结束<br>下载APP观看更多视频</span><p class="end-link">下载有象视频<i class="iconfont icon-download2"></i></p></div>`;

class VideoPlayer extends Component {
    static defaultProps = {
        autoplay: true,
        controls: true,
        loop: true,
        poster: SHORT_VIDEO_IMG_URL.errImgUrl,
        styles: {
            width: document.body.offsetWidth,
            height: document.body.offsetHeight,
            margin: '0 auto',
        },
        className: 'vjs-melephant',
        errorDisplayInnerHtml: ERROR_DISPLAY_INNER_HTML,
        spinningModalInnerHtml: SPINNING_MODAL_INNER_HTML,
        playEndModalInnerHtml: PLAY_END_MODAL_INNER_HTML,
        isNeedSwitch: true
    };
    constructor(props) {
        super(props);
        this.player = null;//player
        this.playerRef = null;//标签的ref
    }

    componentDidMount() {

        let { videoSourcesData, ...otherPorps } = this.props;
        /* 取出option有关的props */
        /* 把其他的非videoOption的属性刨除去 */
        let omitArr = [
            'videoSourcesData',
            'className',
            'styles',
            'updataSrcCallback',
            'callback',
            'errorDisplayInnerHtml',
            'spinningModalInnerHtml',
            'playEndModalOnClick',
            'errorModalOnClick',
        ];
        this.initPlayer({
            videoSourcesData,
            option: omit(otherPorps, omitArr),
        });
        this.addClass(this.props.className);
    }

    componentWillReceiveProps(nextProps) {
        /* 更新poster */
        if (nextProps.poster && nextProps.poster !== this.props.poster) {
            this.player.poster(nextProps.poster);
        }

        /* 更新videoSource '此处要增加深比较' */
        if (nextProps.videoSourcesData && this.props.videoSourcesData && !deepEuqal(nextProps.videoSourcesData, this.props.videoSourcesData)) {
            // if (nextProps.videoSourcesData.data) {
            this.updateSrc(nextProps.videoSourcesData);
            // }
        }
        /* 更改className  */
        if (nextProps.className && nextProps.className !== this.props.className) {
            this.addClass(nextProps.className);
        }
    }

    componentWillUnmount() {
        /* 销毁 */
        if (this.player) {
            this.player = null;
        }
    }
    /**
     * @name hideCustomModal 隐藏自定义的conponent 
     * @param {String} name 自定义Modal的名字
     * 只有加了'vjs-hidden' class的才能执行这些方法
     */
    hideCustomModal = (name) => {
        if (!name && this.player && this.player.childNameIndex_ && this.player.childNameIndex_[name]) {
            return;
        };
        typeof (this.player.childNameIndex_[name].hide) === 'function' && this.player.childNameIndex_[name].hide();
    }
    /**
     * @name hideCustomModal 展示自定义的conponent 
     * @param {String} name 自定义Modal的名字
     * 只有加了'vjs-hidden' class的才能执行这些方法
     */
    showCustomModal = (name) => {
        if (!name && this.player && this.player.childNameIndex_ && this.player.childNameIndex_[name]) {
            return;
        };
        typeof (this.player.childNameIndex_[name].show) === 'function' && this.player.childNameIndex_[name].show();
    }
    /**
     * @name registereEvent 给videojs注册监听事件 
     * 用on 方法
    */
    registereEvent = () => {
        this.player.on('seeked', () => {
            this.hideCustomModal('SpinningModal');
        });
        this.player.on('seeking', () => {
            this.showCustomModal('SpinningModal');
        });

        this.player.on('play', () => {
            this.hideCustomModal('ErrorDisplay');
        });
        this.player.on('error', () => {
            this.player.reset();
            /* 增加错误展示 */
            this.showCustomModal('ErrorDisplay');
        });
        this.player.on('emptied', () => {
            // console.log('emptied', );
        });
        this.player.on('loadeddata', () => {
            // console.log('loadeddata', );
        });
        this.player.on('loadstart', () => {
            // this.player.addChild("SpinningModal");
        });
        this.player.on('ready', () => {
            // console.log('ready', );
        });

        this.player.on('waiting', () => {
            this.showCustomModal('SpinningModal');
        });
        this.player.on('dispose', () => {
            // console.log('dispose', );
        });
        this.player.on('canplay', () => {
            this.hideCustomModal('ErrorDisplay');
            this.hideCustomModal('SpinningModal');
        });
        this.player.on('ended', () => {
            if (this.player.isEnded) {
                // options.videoBaseId && this.player.childNameIndex_.EndDisplay.show();
                this.player.controls(true);
            } else {
                this.player.$emit('onNextVideo');
            }
        });
        this.player.on('fullscreenchange', (screen) => {
            if (!this.player.isFullscreen()) {
                this.hideCustomModal('ErrorDisplay');
                this.player.controls(true);
            }
        });
        this.player.on('texttrackchange', () => {
            // this.hideCustomModal('ErrorDisplay');
        });
    }

    /**
     * @name registereEvent 更新sources switcher 里的方法 ，
     * @param videoSourcesData 要更新的videoSourcesdata
     * 改造了updataSrc,接受一个回调
    */
    updateSrc = async (videoSourcesData = {}, ) => {
        let newSource = [];

        /* 是否需要switcher */
        let isNeedSwitch = this.props.isNeedSwitch;

        /* if 是m3u8类型的，else mp4或者其他的 */
        if (videoSourcesData.type === 'm3u8') {
            let { data = {} } = videoSourcesData;
            /* if (isArray(data.claritys)) 如果没有 claritys，则表示不能分解 */
            if (data.url && isArray(data.claritys)) {
                newSource = await this.parseM3u8(data);
            } else {
                newSource = [{
                    src: data.url,
                    type: 'application/x-mpegURL',
                    label: PLAY_QUALITY[0],
                    res: 'normal'
                }]

            }
        } else if (!videoSourcesData.type || videoSourcesData.type === 'mp4') {
            newSource = isArray(videoSourcesData.data) ? videoSourcesData.data.map(({ type, res, ...item, }) => {
                /* if 没有解析的 那就不需要清晰度了*/
                if (!res) {
                    isNeedSwitch = false;
                }
                return {
                    ...item,
                    res: res || item.label,
                    type: type || 'video/mp4'
                }
            }) : newSource;
        };

        if (newSource.length >= 0) {
            //判断是否需要清晰度。if需要，通过updataSrc.else，则通过src()
            if (isNeedSwitch) {
                this.player.updateSrc(newSource, (player) => {
                    /* updataSrc的回调 */
                    typeof (this.props.updataSrcCallback) === 'function' && this.props.updataSrcCallback();
                });
            } else {
                this.player.src(newSource);
            }
        }
    }

    /* 初始化或者更新 */
    initPlayer = ({ videoSourcesData, option = {}, } = {}) => {
        option = {
            html5: {
                hls: { withCredentials: false },
                hlsjsConfig: {
                    debug: true
                }
            },
            techOrder: ['html5'],
            plugins: {
                videoJsResolutionSwitcher: {
                    ui: true,
                    default: 'high',
                    dynamicLabel: true
                }
            },
            controlBar: {
                children: [
                    'playToggle',
                    'currentTimeDisplay',
                    'progressControl',
                    'durationDisplay',
                    'fullscreenToggle',
                ]
            },
            ...option,
        };

        let _callback = () => {
            /* 建立错误模板 */
            this.buildErrorModal(this.player);
            this.buildSpinningModal(this.player);
            // this.buildPlayEndModal(this.player);

            this.player.addChild("ErrorDisplay");
            this.player.addChild("SpinningModal");

            /* 组件参数传递的内容 */
            if (typeof (this.props.callback) === 'function') {
                this.props.callback()
            }
            /* 注册监听事件 */
            this.registereEvent();

            /* 更新videoSoutcesData */
            if (videoSourcesData && videoSourcesData.data) {
                this.updateSrc(videoSourcesData);
            }
        }

        this.player = videojs(this.playerRef, option, _callback);

    }
    /*  播放结束后 */
    buildPlayEndModal = (player = this.player) => {
        let _me = this;
        const modal = videojs.getComponent('ClickableComponent');
        const innerHTML = this.props.playEndModalInnerHtml;
        const theComponent = videojs.extend(modal, {
            name() {
                return 'PlayEndModal';
            },
            constructor: function (player, options) {
                modal.apply(_me, arguments);
            },
            createEl() {
                return videojs.createEl('div', {
                    innerHTML,
                    className: 'vjs-melephant-ended vjs-hidden',
                });
            },
            handleClick() {
                /* 播放结束后的回调 */
                typeof (_me.props.playEndModalOnClick) === 'function' && _me.props.playEndModalOnClick();
            }
        });
        videojs.registerComponent('PlayEndModal', theComponent);
    }

    /*  spinning模板 */
    buildSpinningModal = (player = this.player) => {
        // let _me = this;
        const innerHTML = this.props.spinningModalInnerHtml;
        const modal = videojs.getComponent('LoadingSpinner');
        const theComponent = videojs.extend(modal, {
            name() {
                return 'SpinningModal';
            },
            constructor: function (player, options) {
                modal.apply(this, arguments);
            },
            createEl() {
                return videojs.createEl('div', {
                    innerHTML,
                    className: 'vjs-melephant-loading vjs-hidden',
                });
            },
        });
        videojs.registerComponent('SpinningModal', theComponent);
    }

    /* 建立错误模块 */
    buildErrorModal = (player = this.player) => {
        const _me = this;
        const innerHTML = this.props.errorDisplayInnerHtml;
        const modal = videojs.getComponent('ClickableComponent');
        const theComponent = videojs.extend(modal, {
            name() {
                return 'ErrorDisplay';
            },
            constructor: function (player, options) {
                modal.apply(this, arguments);
            },
            createEl() {
                return videojs.createEl('div', {
                    innerHTML,
                    className: 'vjs-melephant-error vjs-hidden'
                });
            },
            handleClick() {
                typeof (_me.props.errorModalOnClick) === 'function' && _me.props.errorModalOnClick();
                /* 刷新页面 */
                _me.forceUpdate();
            }
        });
        videojs.registerComponent('ErrorDisplay', theComponent);
    }
    // 解析m3u8
    parseM3u8 = ({ url, claritys, }) => {
        let claritys_sorted = claritys ? claritys.sort((a, b) => parseInt(a) - parseInt(b)) : PLAY_QUALITY;
        const fetchM3u8 = async () => {
            let rtnSource = [];
            return (fetch(url, {}).then((res) => {
                return res.text();
            }).then((res) => {
                const parser = new m3u8Parser.Parser();
                parser.push(res);
                parser.end();
                let { playlists } = parser.manifest;

                if (isArray(playlists, true)) {
                    playlists.forEach((item, index) => {
                        // let arrtHeight = (item.attributes && item.attributes.RESOLUTION && item.attributes.RESOLUTION.height) ? item.attributes.RESOLUTION.height : undefined;
                        let curClarity_i = claritys_sorted[index] ? parseInt(claritys_sorted[index]) : 0;
                        rtnSource.push({
                            src: handleVideoUrl(item.uri),
                            type: 'application/x-mpegURL',
                            // label: arrtHeight === curClarity_i ? claritys_sorted[index] : (arrtHeight + 'p'),
                            label: claritys_sorted[index],
                            res: claritys_sorted[index]
                        });
                    });
                    rtnSource = rtnSource.reverse();
                }
                return rtnSource;

            }))
        };

        return fetchM3u8();

    }
    /* 增加样式 */
    addClass = (className) => {
        className && this.player.addClass(className);
    }
    render() {
        return (
            <div className={styles["videoPlayer"]}>
                <video ref={(node) => this.playerRef = node} className='video-js vjs-default-skin' style={this.props.styles} />
            </div>
        );
    }

}

// VideoPlayer.
export default VideoPlayer;
