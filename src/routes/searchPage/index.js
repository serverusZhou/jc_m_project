import React from 'react';
import { connect } from 'dva';
import styles from './index.less';
import SearchBar from 'components/searchBar';
import NoResult from './component/noResult';
import Videolist from './component/videoList';
import { SEARCH_PAGE_IMG_URL, } from 'utils/imgUrl';
// import { history } from 'utils/history';

class SearchPage extends React.Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
        }
        this.dispatch = this.props.dispatch;
    }
    render() {
        const { searchPageM = {}, commonM = {}, } = this.props;
        const { videoList = [], isShowHotSearch, searchKeyWord, showSuggest, searchContent } = searchPageM;
        const { suggestList, } = commonM;
        const VideolistProps = {
            videoList,
            videoItemOnclick: (videoBaseId, videoDetailId) => {

                this.props.history.push(
                    {
                        pathname: `/play/${videoBaseId}`,
                        search: ``,
                        state: { videoBaseId, videoDetailId }

                    }
                )
            }
        }
        /* ---------------------------------- 上方搜素条 -------------------------------- */
        /**
             * @param {string} searchContent 
             * @todo 1.获取 关键词搜素模板建议词（suggestList）， 2 更新searchContent 和 展示搜索建议面板（showSuggest = true）
             */
        const getSuggestList = (searchContent = searchPageM.searchContent) => {
            this.dispatch({ type: 'commonM/getSuggestList', payload: { searchContent } })
            this.dispatch({ type: 'searchPageM/save', payload: { showSuggest: true, searchContent } })
        };

        /**
         * @todo 隐藏搜索建议面板（showSuggest = false
         */
        const hideSuggest = () => {
            this.dispatch({ type: 'searchPageM/save', payload: { showSuggest: false } });
        };

        const SearchBarProps = {
            suggestList,
            searchKeyWord,
            searchContent,
            showSuggest,
            inputClick: () => {
                if (!showSuggest) {
                    getSuggestList();
                    // this.dispatch({ type: 'searchPageM/save', payload: { showSuggest: true } });
                }
            },
            inputOnChange: (e) => {
                let searchContent = e.target ? e.target.value : '';
                // this.dispatch({ type: 'searchPageM/save', payload: { searchContent } });
                getSuggestList(searchContent);
            },
            hideSuggest,
            clearInput: () => {
                getSuggestList('');
                // this.dispatch({type: 'searchPageM/save', payload: {searchContent: '',}})
            },
            handleSearch: (searchContent) => {
                /* 隐藏模板 */
                hideSuggest();
                /* if searchContent 的值 和当前搜索的keyWord 不一样则 跳转新的页面，else 不动 */
                // if (searchContent || !showSuggest) {
                if (searchContent) {
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
                    // this.dispatch({
                    //     type: 'searchPageM/save', payload: {
                    //         searchContent: '', showSuggest: true
                    //     }
                    // })
                }
            }
        }
        /* ---------------------------------- 上方搜素条 -------------------------------- */
        return (
            <div className={styles["search"]} >
                <SearchBar {...SearchBarProps} />
                {
                    isShowHotSearch && <NoResult noMovieImgUrl={SEARCH_PAGE_IMG_URL.noMovieImgUrl} />
                }

                <Videolist {...VideolistProps} />
            </div>
        )
    }
}

export default connect(({ searchPageM, commonM }) => ({ searchPageM, commonM }))(SearchPage);
