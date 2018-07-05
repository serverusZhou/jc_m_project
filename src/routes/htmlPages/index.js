import React from 'react';
import { Router, Route, Switch, } from 'dva/router';
import { connect } from 'dva';

import AppScoreRule from './routes/appScoreRule';  //金币
import AppNewScoreRule from './routes/appNewScoreRule'; //新金币
import Copyright from './routes/copyright';     //版权
import Intro from './routes/intro'; // 介绍
import UserProtocol from './routes/userProtocol'; //用户协议
import Help from './routes/help'; //帮助
import Protocol from './routes/protocol'; //协议
import styles from './index.less'
class HtmlPages extends React.Component {
    render() {
        let { match, history } = this.props;
        const { path } = match || {};
        return (
            <div className={styles["htmlPages"]}>
                <Router history={history}>
                    <Switch>
                        <Route path={`${path}/appScoreRule.html`} component={AppScoreRule} />
                        <Route path={`${path}/copyright.html`} component={Copyright} />
                        <Route path={`${path}/intro.html`} component={Intro} />
                        <Route path={`${path}/userProtocol.html`} component={UserProtocol} />
                        <Route path={`${path}/help.html`} component={Help} />
                        <Route path={`${path}/appNewScoreRule.html`} component={AppNewScoreRule} />
                        <Route path={`${path}/protocol.html`} component={Protocol} />
                    </Switch>
                </Router>
            </div>
        )
    }
}

export default connect()(HtmlPages);