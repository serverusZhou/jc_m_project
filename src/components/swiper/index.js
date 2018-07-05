import React from 'react';
import { Pagination, } from 'antd-mobile';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import styles from './index.less'
import { ACTIVE_IMG_URL, } from 'utils/imgUrl';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);
const { slideMoreImgUrl } = ACTIVE_IMG_URL;

export default class Swiper extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            index: 0
        }
    }
    handleChangeIndex = (index) => {
        this.setState({
            index: this.state.count ? (index % this.state.count) : 0
        })
    }
    componentDidMount = () => {
        this.setState({
            count: React.Children.count(this.props.children)
        })

    }
    componentWillReceiveProps = (nextProps) => {
        this.setState({
            count: React.Children.count(nextProps.children)
        })
    }


    render() {
        const { children, isPagination, slideMore, isAuto, isDownArray, isToTopBar, ...otherProps } = this.props;
        const { index } = this.state;
        let swipeInner = React.Children.map(children, (item) => item);
        let swiperProps = {
            // containerStyle: {
            //     height: '100vh',
            //     WebkitOverflowScrolling: 'touch', // iOS momentum scrolling
            // },
            index,
            onChangeIndex: this.handleChangeIndex,
            ...otherProps
        };
        return (
            <div className={styles["swiper"]}>
                {isAuto ? (<AutoPlaySwipeableViews {...swiperProps}>
                    {
                        swipeInner
                    }
                </AutoPlaySwipeableViews>) : (
                        <SwipeableViews {...swiperProps}>
                            {
                                swipeInner
                            }
                        </SwipeableViews>
                    )
                }
                {
                    slideMore && <div className={styles["slide-more"]}>
                        <img src={slideMoreImgUrl} alt="" />
                    </div>
                }
                {
                    isPagination && <Pagination mode="pointer" total={React.Children.count(children)} current={index} onChange={this.handleChangeIndex} />
                }
                {
                    (isDownArray && (index + 1 < this.state.count)) && <div className={styles["next"]} onClick={() => this.handleChangeIndex(index + 1)}>

                    </div>
                }
                {

                    (isToTopBar && index !== 0) && <div className={styles["totop"]} onClick={() => this.handleChangeIndex(0)}></div>
                }
            </div>
        )
    }
};




// import React from 'react';
// import SwipeableViews from 'react-swipeable-views';
// import SupportTouch from 'docs/src/modules/components/SupportTouch';

// const styles = {
//   slideContainer: {
//     height: 100,
//   },
//   slide: {
//     padding: 15,
//     minHeight: 100,
//     color: '#fff',
//   },
//   slide1: {
//     backgroundColor: '#FEA900',
//   },
//   slide2: {
//     backgroundColor: '#B3DC4A',
//   },
//   scroll: {
//     height: 100,
//     overflow: 'scroll',
//   },
//   slide3: {
//     height: 200,
//     backgroundColor: '#6AC0FF',
//   },
// };

// function DemoAxis() {
//   return (
//       
//   );
// }

// export default DemoAxis;