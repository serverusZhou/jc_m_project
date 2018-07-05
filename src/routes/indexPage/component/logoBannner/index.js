import React from 'react'

import Logo from 'components/logo'
import SearchBar from 'components/searchBar'
import { jumpApp } from 'utils/jump'

import styles from './index.less'

export default class LogoBannner extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isShowSearch: false,
    }
  }
  showSearch = (e) => {
    this.setState({
      isShowSearch: true
    })
    if (this.props.SearchBarProps && typeof (this.props.SearchBarProps.inputClick) === 'function') {
      this.props.SearchBarProps.inputClick();
    }
  }
  /* 跳转app */
  gotoAppFun = (e) => {
    jumpApp.openBrowserToAppOrDownload({ action: 'home' });
  }

  render() {
    const { SearchBarProps = {} } = this.props;
    return (
      <div style={{ height: '100%' }}>
        <div className={styles["logo-bannner"]}>
          <div className={styles["logo-bannner-wrap"] + ' ' + styles["clearfix"]}>
            <Logo></Logo>
            <div className={styles["btn-wrap"]}>
              <button className={styles["btn-search"]} onClick={this.showSearch}></button>
              <button className={styles["open-app"]} onClick={this.gotoAppFun}>打开APP</button>
            </div>
          </div>
        </div>
        {this.state.isShowSearch && <SearchBar  {...SearchBarProps} />}
      </div>
    )
  }
}