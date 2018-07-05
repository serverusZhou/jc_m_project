/**
 * @author xiangrenya <xiangrenya@jcgroup.com.cn>
 * @since 2018-06-04
 */

import React, { Component } from 'react'
import cn from 'classnames'

import { jumpApp } from 'utils/jump'
import styles from './index.less'
import imgLogo from 'imageAssets/activity/icon_logo.png'
import imgDel from 'imageAssets/activity/icon_del.png'


export default class fixBottom extends Component {
  handleDownLoadClick = () => {
    jumpApp.openBrowserToAppOrDownload({ action: 'home' });
  }
  render() {
    const { show, onClose } = this.props;
    const bottomClass = cn(
      styles['download-footer'],
      {
        [styles['down']]: !show
      }
    );
    return (
      <div className={bottomClass}>
        <img src={imgDel} width="13" height="13" alt="" onClick={onClose} />
        <img className={styles['elephant']} src={imgLogo} width="44" height="44" alt="" />
        <div className={styles['download-text']}>
          <header>有象视频</header>
          <sub>下载观看完整高清视频</sub>
        </div>
        <button onClick={this.handleDownLoadClick}>下载APP</button>
      </div>
    )
  }
}
