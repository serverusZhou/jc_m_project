/**
 * @author gp
 * @email gengpeng@jcgroup.com.cn
 * @desc 左上角的Logo
 */

import React from 'react'
import { Link } from 'react-router-dom';

import styles from './index.less'

import {COMMON_IMG_URL} from 'utils/imgUrl';
/**
 * @name Logo
 * @prop 
 */
const Logo = ({channelIdArr=[]}) => {
  return (
    <div className={styles["logo-youxiang"]}>
      <Link to={{
        pathname: `/index${(channelIdArr && channelIdArr[0] !== undefined)?('/'+channelIdArr[0]):''}`,
        state: { channelId: channelIdArr[0] }
      }}>
        <img src={COMMON_IMG_URL.logoImgSrc} alt="logo" />
      </Link>
    </div>
  )
};

export default Logo;