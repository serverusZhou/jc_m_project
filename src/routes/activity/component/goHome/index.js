/**
 * @author xiangrenya <xiangrenya@jcgroup.com.cn>
 * @since 2018-06-04
 */

import cn from 'classnames'
import styles from './index.less'
import imgGoHome from 'imageAssets/activity/icon_home.png'
import { Link } from 'react-router-dom';

const goHome = ({ show }) => {
  const homeClass = cn(
    styles['go-home'],
    {
      [styles['down']]: !show
    }
  );
  return (
    <Link to="/index/0">
      <img className={homeClass} src={imgGoHome} width="50" height="50" alt="" />
    </Link>
  )
}

export default goHome;