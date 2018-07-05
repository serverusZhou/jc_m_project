import 'babel-polyfill';
import dva from 'dva';
import './index.less';
import 'antd-mobile/dist/antd-mobile.css';  // o 'antd-mobile/dist/antd-mobile.less'
import './styles/m-index.css';
import { history } from 'utils/history.js';

// import createHistory from 'history/createBrowserHistory';

// const app = dva();
// 1. Initialize
const app = dva({
    history,
})

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/commonM').default);
app.model(require('./models/indexPageM').default);
app.model(require('./models/searchPageM').default);
app.model(require('./models/playPageM').default);
app.model(require('./models/shortVideoM').default);//短视频
app.model(require('./models/activityM').default);//活动页
app.model(require('./models/livePageM').default);//直播
app.model(require('./models/personPageM').default); //个人主页
app.model(require('./models/htmlPagesM').default); //h5嵌套的

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');