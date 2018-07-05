# videoPlayer
--- ---

## Props

| prop                   | desc                                    | type                                    | 默认值                                                                                                                                               |
|------------------------|-----------------------------------------|-----------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| autoplay               | 是否自动播放                                  | Boolean                                 |                                                                                                                                                   |
| videoSourcesData       | 视频sources,如果是m3u8，格式是object             | <VideoSourcesData>Array ```or``` Object | ```[]```                                                                                                                                          |
| poster                 | 图片                                      | String                                  | 🐘图片                                                                                                                                              |
| controls               | 控制条                                     | Boolean                                 | ```true```                                                                                                                                        |
| styles                 | 样式                                      | Object                                  | ```{width: document.body.offsetWidth,height: document.body.offsetHeight,margin: '0 auto',}```                                                     |
| loop                   | 循环                                      | Boolean                                 | ```true```                                                                                                                                        |
| className              | 样式                                      | String                                  | ```vjs-melephant```                                                                                                                               |
| updataSrcCallback      | switcher 中更新source的回调                   | Function                                | ```undefined```                                                                                                                                   |
| callback               | 回调  (player)=>{}                        | Function                                | ```undefined```                                                                                                                                   |
| errorDisplayInnerHtml  | 错误模板上，拼接的html                           | String                                  | ```<div class="content-wrap"><p class="error-text">加载失败，请检查网络设置</p><p class="error-reload"><i class="iconfont icon-refresh"></i>刷新重试</p></div>``` |
| spinningModalInnerHtml | loading模板上，拼接的html                      | String                                  | ```<div class="content-wrap"><img class="loading-gif" src="${require('../../assets/play/loading.gif')}" alt=""><p>加载中</p></div>```                |
| playEndModalOnClick    | 播放结束后模板上，点击回调事件                         | Function                                | ()=>{}                                                                                                                                            |
| errorModalOnClick      | 错误模板上，点击回调事件                            | Function                                | ()=>{}                                                                                                                                            |
| isNeedSwitch           | 是否需要清晰度的切换                              | Boolean                                 | ```true```                                                                                                                                        |
| 其他                     | 详见 [video.js](http://docs.videojs.com/) |                                         |                                                                                                                                                   |

#### VideoSourcesData
| prop | desc   | type                    | 默认值       |
|------|--------|-------------------------|-----------|
| data | 视频地址   | <VideoSourcesData.data> |           |
| type | 清晰度的文字 | Enum< mp4,m3u8>         | ```mp4``` |


#### VideoSourcesData.data 

##### <b>1.type = mp4<b>  

```Array```

| prop  | desc   | type   | 默认值               |
|-------|--------|--------|-------------------|
| src   | 视频地址   | String |                   |
| label | 清晰度的文字 | String | ```undefined```   |
| res   | 清晰度的id | String | 同```label```      |
| type  | 视频的种类  | String | ```'video/mp4'``` |

##### <b>2.type = m3u8<b> 

```Object```

| prop     | desc   | type   | 默认值      |
|----------|--------|--------|----------|
| url      | 视频地址   | String | ```''``` |
| claritys | 清晰度的文字 | Array  | ```''``` |

----
### Next Version Props 

| prop             | desc     | type                | 默认值                        |
|------------------|----------|---------------------|----------------------------|
| playStatus       | 播放状态     | enum < pasud,play > | ```''```                   |
| buildCustomModal | 自定义的播放组件 | function            | ```(vidojs, player)=>{}``` |


## Demo
```jsx
 /* 视频播放 */
const VideoPlayerProps = {
    videoSourcesData: {
        data: [
            {
                src: 'http://video.youxiang0210.com/猎场正片01_mp4_240P_20171107.mp4',
                type: 'video/mp4',
                label: '240p',
                res: '240'
            },{
                src: 'http://video.youxiang0210.com/猎场正片01_mp4_480P_20171107.mp4',
                type: 'video/mp4',
                label: '480p',
                res: '480'
            },{
                src: 'http://video.youxiang0210.com/猎场正片01_mp4_960P_20171107.mp4',
                type: 'video/mp4',
                label: '960p',
                res: '960'
            },{
                src: 'http://video.youxiang0210.com/猎场正片01_mp4_1080P_20171107.mp4',
                type: 'video/mp4',
                label: '1080p',
                res: '1080'
            },
        ],
        type: 'mp4',
    },
    autoplay: false,
    styles: {
        width: '100%',
        height: '100%'
    },
    poster:'http://dx-image-test.itangchao.me/back-1513231435256-cFFwyA48hJ',
}
return 
<VideoPlayer {...VideoPlayerProps} />

```