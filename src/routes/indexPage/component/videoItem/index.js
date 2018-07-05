/**
 * @author gp
 * @email gengpeng@jcgroup.com.cn
 * @desc 根据频道分的单个视频块，处理模板
 * @type UI 组件
 */
import React from 'react';
// // import LazyLoad from 'react-lazyload';
// import addEventListener from 'rc-util/lib/Dom/addEventListener';
import { Link } from 'react-router-dom';

import RecommendVideos from '../../component/recommendVideos';
import SingleVideo from 'components/singleVideo';
// import SingleCarouselVideo from 'components/singleCarouselVideo';
import { IMAGE_URL } from 'utils/config';

import { isArray } from 'utils/toolFunc';
import { INDEX_PAGE_IMG_URL, } from 'utils/imgUrl';



import styles from './index.less';

const SHOW_NUM = 4; //展示的电影个数（换一批的 个数）
/**
 * @name VideoItem 
 * @prop {object} videoData 包含标题和每个小视频
 * @prop {string} channelId 当前频道channelID
*/
export default class VideoItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      newVideoListItem: [],//视频list
      newRecommendList: [],
      currentPage: 0,
      mode: 'horizontal'
    }
  }
  
  changePageNum = () => {
    let currentPage = (this.state.currentPage + 1) % (this.state.VideoListLength / SHOW_NUM);
    this.initVideoData(currentPage);
  }

  /* 换一批 获取随机 影片 */
  // getRandom = (arr) => {
  //   let indexArr = [];
  //   while (indexArr.length < SHOW_NUM) {
  //     let rand = Math.round(Math.random() * arr.length);
  //     indexArr.indexOf(rand) === -1 && indexArr.push(rand); //避免重复
  //   }
  //   return indexArr.map(item => arr[item]);//根据 indexArr 的值，得到原数组的元素并返回
  // }
  /* 根据 layoutId 生成模板 initVideoData */
  initVideoData = (currentPage = this.state.currentPage) => {
    const { videoData = {} } = this.props;
    var newVideoListItem = [],    //处理后的newVideoList
      newRecommendList = [],    //推荐列表
      adData = [],              //广告
      isShowBottomBtn = false,  // 是否显示底部按钮
      VideoListLength = 0; //视频总数

    // if 没数据，直接跳过
    if (isArray(videoData.videos) && videoData.layoutId) {

      switch (videoData.layoutId) {

        case 3: {
          /* 模板3 全是 竖直的 */
          newVideoListItem = videoData.videos.slice(0, 6).map((item) => ({ ...item, mode: 'vertical' }));
          break;
        }
        case 5: {
          /* 模板5 第一个是占一行，第二个是两行一个 */
          newVideoListItem = videoData.videos.slice(0, 5).map((item, key) => ({ ...item, mode: key === 0 ? 'large' : 'horizontal' }));
          break;
        }
        case 8: {
          /* 模板8 是 带推荐 标题的*/
          /* 学一波谷歌规范，循环全用for of */
          for (const item of videoData.videos) {
            item.scale === 1 && newVideoListItem.push({ ...item, mode: 'horizontal' })
            item.scale === 0 && newRecommendList.push(item)
          }
          break;
        }
        case 9: {
          for (const item of videoData.videos) {
            (item.scale === 6 && videoData.adEnable) && adData.push(item);
            item.scale === 1 && newVideoListItem.push({ ...item, mode: 'horizontal', isShowSubName: true });
            item.scale === 0 && newRecommendList.push(item)
          }
          /* 换一批按钮的算法  */
          VideoListLength = newVideoListItem.length;
          newVideoListItem = newVideoListItem.slice((currentPage) * SHOW_NUM, (currentPage + 1) * SHOW_NUM);
          isShowBottomBtn = true;
          break;
        }
        default: {
          newVideoListItem = videoData.videos.map(item => ({ ...item, mode: 'horizontal' }));
          break;
        }
      }
      this.setState({
        newVideoListItem, newRecommendList, isShowBottomBtn, VideoListLength, currentPage
      })
    }


  }

  componentDidMount = () => {
    // this.scrollEvent = addEventListener(window, 'scroll', this.handleScroll);

  }
  componentWillMount = () => {
    this.initVideoData();
  }

  componentWillReceiveProps = (nextProps) => {
    this.initVideoData();
  }

  render() {
    const { videoData = {} } = this.props;
    const { newRecommendList, newVideoListItem, isShowBottomBtn, } = this.state;
    return (
      <div className={styles["video-list"]}>
        <div className={styles["videos-list-title-wrap"]}>
          {/* <LazyLoad height={30}> */}
          {videoData.iconImgUrl && <img src={IMAGE_URL + videoData.iconImgUrl} className={styles["videos-list-title-icon"]} alt='' />}
          {/* </LazyLoad> */}
          <h3 className={styles["videos-list-title"]}>
            {videoData.title}
          </h3>
        </div>
        {
          newRecommendList.map((item, key) => (
            <RecommendVideos key={key} item={item} />
          ))
        }
        <div className={styles["videos-wrap"] + ' ' + styles[`videos-layOut${videoData.layoutId}-wrap`]}>
          {
            isArray(newVideoListItem) && newVideoListItem.map((item, key) => {
              return <SingleVideo key={key} isShowSubName={item.isShowSubName} singleVideoData={item} mode={item.mode} />
            })
          }
        </div>
        <div className={styles["list-line"]}></div>
        {
          /* 看是否需要下方按钮 */
          isShowBottomBtn && (
            <div className={styles["bottomBtns"]}>
              <Link className={styles["moreVideos"]} to={{
                pathname: `/index/${videoData.moreId || ''}`,
                state: { channelId: videoData.moreId }
              }}><img src={INDEX_PAGE_IMG_URL.homeMoreUrl} alt="" /><span>查看更多</span>
              </Link>
              <i className={styles["verticalLine"]}></i>
              <div className={styles["otherPage"]} onClick={() => this.changePageNum()}>
                <img src={INDEX_PAGE_IMG_URL.homeChangeUrl} alt="" /><span>换一批</span>
              </div>
            </div>
          )
        }
      </div>
    )
  }
};
