// import createHistory from 'history/createHashHistory';
import createHistory from 'history/createBrowserHistory';

/* 将 history 统一*/
const history = createHistory();
history.listen((location, action) => {
    // console.log(
    //     `The current URL is ${location.pathname}${location.search}${location.hash}`
    // )
    // console.log(`The last navigation action was ${action}`)
})

export { history }
