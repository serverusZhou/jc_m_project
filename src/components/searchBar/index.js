import React from 'react'
import styles from './index.less'
import Logo from '../logo'
import { isArray } from 'utils/toolFunc';
import { COMMON_IMG_URL } from 'utils/imgUrl';

export default class SearchBar extends React.Component {
    constructor(state) {
        super(state)
        this.state = {
            // searchContent: null,
            // showSuggest: false,
            // showLightShade: false,
        }
    }
    // init = (props) => {
    //     if (this.state.searchContent === null) {
    //         let { searchKeyWord } = props;
    //         this.setState({
    //             searchContent: searchKeyWord,
    //         })
    //     }
    // }

    // componentWillReceiveProps = (nextProps) => {
    //     this.init(nextProps);
    // }
    // componentWillMount = () => {
    //     this.init(this.props);
    // }

    /**
     * @name clearInput
     * @todo 1.清空输入框的 2.展示建议
     */
    clearInput = () => {
        typeof (this.props.clearInput) === 'function' && this.props.clearInput();
    }

    /**
     * @name inputOnChange 
     * @todo 1.输入框变更事件
     */
    inputOnChange = (e) => {
        typeof (this.props.inputOnChange) === 'function' && this.props.inputOnChange(e);
    }

    /**
     * @name inputClick 
     * @todo 1.输入框获取焦点 2.调用获取关键词建议列表，并展示建议面板
     */
    inputClick = () => {
        typeof (this.props.inputClick) === 'function' && this.props.inputClick();
    }

    /**
     * @name hideSuggest 隐藏建议面板
     */
    hideSuggest = () => {
        typeof (this.props.hideSuggest) === 'function' && this.props.hideSuggest();
    }

    /**
     * @name handleSearch
     * @todo 1.隐藏模板,2.如果是‘搜索’则跳转，否则不动
     */
    handleSearch = (searchContent) => {
        typeof (this.props.handleSearch) === 'function' && this.props.handleSearch(searchContent)
    }
    // /**
    //  * 
    //  * @name getSuggestList 获取建议列表的数据
    //  * @todo 调用父组件传递的方法
    //  */
    // getSuggestList = (searchContent) => {
    //     typeof (this.props.getSuggestList) === 'function' && this.props.getSuggestList(searchContent);
    // }


    componentDidMount = () => {
    }

    render() {
        const { searchContent, showSuggest, suggestList, style = {} } = this.props;
    
        let showSuggestClassName = this.state.showLightShade ? styles["shade"] + ' ' + styles['lightshade'] : styles["shade"];
        return <div className={styles["search"]} style={style || {}}>
            <div className={styles["search-bar"]}>
                <div className={styles["logo-wrap"]} onClick={this.gotoIndex}>
                    <Logo></Logo>
                </div>
                <div className={styles["search-input"]}>
                    <div className={styles["input-panel"]}></div>
                    <div className={styles["input-content"]}>
                        <div className={styles["search-icon-box"]}><img className={styles["search-icon"]} src={COMMON_IMG_URL.searchIconSrc} alt='' /></div>
                        <input type="text" value={searchContent || ''} onClick={this.inputClick} onChange={this.inputOnChange} placeholder="请输入影片" maxLength="20" autoFocus />
                        {
                            !!searchContent && <div className={styles["clear-icon-box"]} onClick={this.clearInput} >
                                <img src={COMMON_IMG_URL.clearIconSrc} alt='' />
                            </div>
                        }
                    </div>
                </div>
                <div className={styles["search-btn"]} onClick={() => this.handleSearch(searchContent)} >
                    {
                        /* 建议面板 不出来 永远是搜素，只有当面版出来时，才会判断是搜索还是取消 */
                        (searchContent || !showSuggest) ? <div className={styles["search-txt"]}>搜索</div> : <div className={styles["cancel-btn"]}>取消</div>
                    }
                </div>
            </div>

            {
                showSuggest && <div className={styles["search-suggest"]}>
                    <ul>
                        {
                            isArray(suggestList) && suggestList.map((item, key) => {
                                let videoNameArr = item.videoName.split(searchContent);
                                return (
                                    <li onClick={() => { this.handleSearch(item.videoName) }} key={key}>
                                        <a>{
                                            isArray(videoNameArr) && videoNameArr.map((item, key) => {
                                                let rtn = [];
                                                if (key !== 0) {
                                                    rtn = [<span className={styles["suggest-text"]} key={key + 'keyword'}>{searchContent}</span>];
                                                }
                                                return [...rtn, <span key={key}>{item}</span>]
                                            })}</a>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div >
            }
            {
                showSuggest && <div className={showSuggestClassName} onClick={this.hideSuggest}></div >
            }
        </div >
    };
}