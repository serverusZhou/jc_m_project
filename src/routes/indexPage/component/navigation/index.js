/**
 * @author GP
 * @data 2018.4.3
 * @email gengpeng@jcgroup.com.cn
 * @desc 导航
 */
import React from 'react';

import { Link } from 'react-router-dom';
import { isArray } from 'utils/toolFunc';
import styles from './index.less';
/**
 * @name Navigation
 * @prop {< {name,id} >[]} channelList 导航的列表
 * @prop {string} channelId 当前导航
 * @prop {func} changeChannel 改变频道参数
 */

export default class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.navigationRef = null;
  }
  /* 改变导航位置，方便由于跳转的时候当前导航显示在屏幕内 */
  changePosition = (e) => {

    if (this.navigationRef) {
      const { channelList, channelId } = this.props;
      let count = isArray(channelList) ? channelList.map((item) => item.id + '').indexOf(channelId + '') : 0;

      count = count > 3 ? count - 2.5 : 0;
      this.navigationRef.scrollLeft = count * 62.5;
    }
  }

  componentDidMount = () => {
    this.changePosition();

  }
  componentDidUpdate = (prevProps, prevState) => {
    this.changePosition();
  }


  render() {
    const { channelList, channelId, changeChannel = () => { } } = this.props;

    // this.navigationRef.scrollLeft 
    // this.navigationRef && console.log('navigacomponentDidMounttionRef', this.navigationRef.scrollLeft,this.navigationRef.scrollWidth, this.navigationRef.offsetWidth);
    return isArray(channelList, true) ? (
      <div className={styles["navigation"]} >
        <ul className={styles["navigation-item-container"]} onClick={this.move} ref={(ref) => this.navigationRef = ref}>
          {
            channelList.map((item, key) => {
              /* 如果是当前的 页面 就用active-item ,如果不是 就用item */
              let _className = styles[(channelId + '') === (item.id + '') ? 'navigation-item-active' : 'navigation-item'];
              return (
                <li key={key} className={_className} onClick={() => { }}>
                  <Link key={key} to={{
                    pathname: `/index/${item.id}`,
                    state: { channelId: item.id }

                  }} onClick={() => changeChannel(item.id)}>
                    {item.name}
                  </Link>
                </li>
              )
            })
          }
        </ul>
      </div>
    ) : null
  }
}
