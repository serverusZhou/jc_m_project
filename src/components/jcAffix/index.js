/**
 * @author GP
 * @data 2018.4.3
 * @email gengpeng@jcgroup.com.cn
 * @desc 固钉
 */
import React  from 'react'

/**
 * @name Affix
 * @prop {<css>object} style css 的样式，如果要使用绝对定位可以手动传
 * @prop {ReactDom} children 
 * @prop {number} offsetTop 距离顶部的距离，如果是负的就表示距离底部的距离
 * @prop {number} offsetRight 距离右边的距离，如果是负的就表示距离左部的距离
 * @prop {number} zIndex css 中的zIndex
 */
const Affix = ({ style, children,offsetTop=0,offsetRight=0,zIndex = 9999,...otherProps}) => {
    let _style = {
        position: 'fixed',
        zIndex:zIndex+'',
    }
    /* if offsetTop* <0  就表示距离底部和距离左边 ，页面中心点为坐标轴原点 */
        if (offsetTop < 0) {
            _style.bottom = offsetTop * -1 + 'px';
        } else {
            _style.top = offsetTop * 1 + 'px';
        }
        if (offsetRight < 0) {
            _style.left = offsetRight * -1 + 'px';
        } else {
            _style.right = offsetRight * 1 + 'px';
        }
    /* 如果 手动传了样式，则用手动的样式 */
    _style = {
        ..._style,
        ...style
    };
    const _props = {
        ...otherProps,
        style : { ..._style }
    }
    return (
        <div  {..._props}>
            
            {
                children
            }
        </div>
    )
}

export default Affix;