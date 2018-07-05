import React from 'react';
import { connect } from 'dva';
/* 页面独有组件 */
import LogoBannner from './component/logoBannner';
import Navigation from './component/navigation';
import Banner from './component/banner';
// import LoadError from './component/loadError';
import VideoList from './component/videoList';

/* 公共组件 */
import ErrorInPage from 'components/errorInPage';
import ToTopBar from 'components/toTopBar';
import JcAffix from 'components/jcAffix';
// import { Router, Route, Switch, Redirect } from 'dva/router';
import { isArray } from 'utils/toolFunc';
import { VIDEO_ERROR_TEXT, } from 'utils/constant';
import { INDEX_PAGE_IMG_URL, } from 'utils/imgUrl';
const { loadErrorImgUrl } = INDEX_PAGE_IMG_URL;
// import { history } from 'utils/history';

class Index extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.dispatch = this.props.dispatch;
  }
  render() {
    const { indexPageM = {}, commonM = {} } = this.props;
    /* 详细注释可看indexPageM.js */
    const {
      bannerList = [], channelId, legoChannels, videoListLoading,
      /* 搜素相关 */
      searchContent, showSuggest
    } = indexPageM;
    /* 详细注释可看indexPageM.js */
    const { channelList, suggestList, } = commonM;

    /* ---------------------------------- 导航 -------------------------------- */
    const NavigationProps = {
      channelList,
      channelId,
      /* 改变导航 */
      changeChannel: (channelId) => {
        this.dispatch({
          type: 'indexPageM/getLegoChannels', payload: {
            isInit: true,
            channelId,
          }
        });
      }
    };
    /* ---------------------------------- 导航 -------------------------------- */

    /* ---------------------------------- 轮播 -------------------------------- */
    const BannerProps = {
      bannerList,
      sliderProps: {
        autoplaySpeed: 5000,
        dots: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
      }
    };
    /* ---------------------------------- 轮播 -------------------------------- */

    /* ---------------------------------- 视频列表 -------------------------------- */
    const VideoListProps = {
      legoChannels: legoChannels,
      channelId: channelId,
      onEndReached: () => {
        this.dispatch({ type: 'indexPageM/getLegoChannels', })
      },
      videoListLoading
    }
    /* ---------------------------------- 视频列表 -------------------------------- */

    /* ---------------------------------- 上方搜素条 -------------------------------- */
    /**
     * @param {string} searchContent 
     * @todo 1.获取 关键词搜素模板建议词（suggestList）， 2 更新searchContent 和 展示搜索建议面板（showSuggest = true）
     */
    const getSuggestList = (searchContent = indexPageM.searchContent) => {
      this.dispatch({ type: 'commonM/getSuggestList', payload: { searchContent } })
      this.dispatch({ type: 'indexPageM/save', payload: { showSuggest: true, searchContent } })
    };
    /**
     * @todo 隐藏搜索建议面板（showSuggest = false
     */
    const hideSuggest = () => {
      this.dispatch({ type: 'indexPageM/save', payload: { showSuggest: false } });
    };

    const LogoBannnerProps = {
      SearchBarProps: {
        suggestList,
        searchContent,
        showSuggest,
        inputClick: () => {
          if (!showSuggest) {
            getSuggestList();
            // this.dispatch({ type: 'indexPageM/save', payload: { showSuggest: true } });
          }
        },
        inputOnChange: (e) => {
          let searchContent = e.target ? e.target.value : '';
          // this.dispatch({ type: 'indexPageM/save', payload: { searchContent } });
          getSuggestList(searchContent);
        },
        hideSuggest,
        clearInput: () => {
          getSuggestList('');
          // this.dispatch({type: 'indexPageM/save', payload: {searchContent: '',}})
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
          }
        }
      }
    }
    /* ---------------------------------- 上方搜素条 -------------------------------- */


    return (
      <div>
        {/* 固钉 */}
        <JcAffix style={{ left: '0px' }}>
          <LogoBannner {...LogoBannnerProps} ></LogoBannner>
          <Navigation {...NavigationProps}></Navigation>
        </JcAffix>
        {
          /* 轮播 */
          (isArray(bannerList, true)) && <Banner {...BannerProps}></Banner>
        }
        {
          /* 视频列表 */
          (isArray(legoChannels, true)) ? (
            <VideoList {...VideoListProps}></VideoList>
          ) : (
              // <LoadError errorText={VIDEO_ERROR_TEXT} loadErrorImgUrl={}></LoadError>
              <ErrorInPage errorTipText={VIDEO_ERROR_TEXT}></ErrorInPage>
            )
        }
        {/* 回到顶部 */}
        <ToTopBar />
      </div>
    )
  }
}

export default connect(({ indexPageM, commonM }) => ({ indexPageM, commonM }))(Index);


