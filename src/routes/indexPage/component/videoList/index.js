/**
 * @author gp
 * @email gengpeng@jcgroup.com.cn
 * @desc 视频列表
 */
import React from 'react';
import ReactDOM from 'react-dom';
// // import LazyLoad from 'react-lazyload';
// import addEventListener from 'rc-util/lib/Dom/addEventListener';
import { ListView, } from 'antd-mobile';

import VideoItem from '../videoItem';
import styles from './index.less';

/**
 * @name VideoList 
 * @prop {object} videoData 包含标题和每个小视频
 * @prop {string} channelId 当前频道channelID
*/
export default class VideoList extends React.Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    this.state = {
      dataSource,
      height: document.documentElement.clientHeight,

    };
  }
  /* 有待研究此api */
  onRefresh = () => {
    typeof (this.props.onRefresh) === 'function' && this.props.onRefresh()
  };
  /* 有待研究此api */
  onEndReached = (event) => {
    if (this.props.videoListLoading) {
      return;
    }
    typeof (this.props.onEndReached) === 'function' && this.props.onEndReached()
  };

  // If you use redux, the data maybe at props, you need use `componentWillReceiveProps`
  componentWillReceiveProps(nextProps) {

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(nextProps.legoChannels),
    });
  }
  componentDidUpdate() {
    document.body.style.overflow = 'auto';
  }
  componentDidMount() {
    const hei = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop;

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.props.legoChannels),
      height: hei,
      // videoListLoading: false,
    });
  }
  render() {
    /* 要渲染的内部组件 */
    const renderRow = (rowData, sectionID, rowID) => {
      const VideoItemProps = {
        channelId: this.props.channelId,
        key: rowID,
        videoData: rowData,
      }
      return <VideoItem {...VideoItemProps}></VideoItem>
    };
    return (
      <ListView
        key={Date.now() + Math.random()}
        ref={el => this.lv = el}
        className={styles["video-list-box"]}
        dataSource={this.state.dataSource}
        renderFooter={() => this.props.videoListLoading ? (<div style={{ padding: 30, textAlign: 'center' }}>
          玩命加载中...
        </div>) : null}
        renderRow={renderRow}
        useBodyScroll={true}

        onEndReached={this.onEndReached}
        pageSize={5}
      />);
  }
};