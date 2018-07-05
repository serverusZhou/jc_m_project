import React from 'react';
// import { Router, Route, Switch,Redirect,routerRedux } from 'dva/router';
import { Router, Route, Switch, Redirect } from 'dva/router';
// import { BrowserRouter } from 'react-router-dom';

import NotFound from './routes/notFound';//错误页
import Download from './routes/download';//下载
import SearchPage from './routes/searchPage';//搜索页
import IndexPage from './routes/indexPage';//主页
import BrowserOpen from './routes/browserOpen';//打开页
import PersonPage from './routes/personPage';//个人主页
import ShortVideo from './routes/shortVideo';// 短视频页
import PlayPage from './routes/playPage';//视频播放页
import LivePage from './routes/livePage';//直播页面
import Activity from './routes/activity';//活动页面
import HtmlPages from './routes/htmlPages';//h5嵌套的静态

const RouterConfig = ({ app, history }) => {
    return (
        <Router history={history}>
            {/* <BrowserRouter {...BrowserRouterProps}> */}
            <Switch>
                <Redirect from='/index' to='/index/0' exact />
                <Redirect from='/' to='/index/0' exact />
                <Route path="/index/:channelId?" component={IndexPage} exact />
                <Route path='/search' component={SearchPage} exact />
                <Route path='/download' component={Download} exact />
                <Route path='/personPage' component={PersonPage} exact />
                <Route path='/browserOpen' component={BrowserOpen} exact />
                <Route path='/play/:videoBaseId' component={PlayPage} exact />
                <Route path='/shortVideo/:videoId' component={ShortVideo} exact />
                <Route path='/live/:roomId' component={LivePage} exact />
                <Route path='/activity/:activityId' component={Activity} exact />
                <Route path='/notFound' component={NotFound} />
                <Route path='/pages' component={HtmlPages} />
                <Route component={NotFound} />
            </Switch>
            {/* </BrowserRouter> */}
        </Router>
    );
}

export default RouterConfig;
