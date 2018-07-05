/**
 * @author GP
 * @data 2018.4.10
 * @email gengpeng@jcgroup.com.cn
 * @desc 我是微信其他浏览器打开页面
 */
import React from 'react';
import { BROWSER_OPEN_IMG_URL } from 'utils/imgUrl';
import { jumpApp } from 'utils/jump';
import styles from './index.less';
const { wechatIosImgUrl, wechatAndroidImgUrl } = BROWSER_OPEN_IMG_URL;

export default class BrowserOpen extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isIos: false,//是不是ios
    }
  }

  /* 判断浏览器 */
  getType = () => {
    /* 判断是否是苹果 */
    this.setState({
      isIOS: jumpApp.isIOS()
    })
    // if 是原生浏览器（不是微信，微博等内置浏览器。。。）
    if (jumpApp.isOriginalBrowser()) {
      this.toAppType()
    }
  }
  toAppType = () => {
    let { search: searchParam } = this.props.location || {};
    alert('toAppType: =' + searchParam)
    jumpApp.openAppAndToDownloadPage({ searchParam })
  }

  componentDidMount = () => {
    this.getType()
  }

  render() {
    const imgSrc = this.state.isIos ? wechatIosImgUrl : wechatAndroidImgUrl;
    return (
      <div className={styles["wechat-cover"]}>
        <img src={imgSrc} alt=""/>
      </div>
    )
  }
}