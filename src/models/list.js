// import { routerRedux } from 'dva/router';
import fetchList from '../services/list';

// 通过subscriptions 监听/路径。
// 进入路由就会根据queryString.tab,来做判断
// 如果tab为空或者all,则fetch 拉取全部的内容
// 如果tab为其他，则根据相应的tab内容来拉取内容。
export default {

  namespace: 'list',

  state: {
    firstLoading: true,
    refreshing: false,
    currentTab: 'all',
    currentPage: 1,
    listData: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      // 监听 "/"路径，然后获取queryString中的tab,
      // 发出query动作，拉取信息。
      history.listen((location) => {
        const { pathname } = location;
        if (pathname === '/') {
          // setTimeout(() => {
          //   const listScrollViewContent = document.querySelector('.am-list-view-scrollview-content');
          //   listScrollViewContent.style.transform = 'translate3d(0px, 0px, 0px)';
          //   console.log(listScrollViewContent.style.transform);
          // });
          const { query } = location;
          const { tab } = query;
          const queryStringTab = tab === undefined && 'all' ? 'all' : tab;
          dispatch({
            type: 'judgeFirstLoading',
            payload: {
              tab: queryStringTab,
            },
          });
        }
      });
    },
  },

  effects: {
    // 开始进入时触发的动作。takeLatest保证数据只拉取一次。
    *judgeFirstLoading({ payload }, { put, select }) {
      const list = yield select(state => state.list);
      const { firstLoading } = list;
      const { tab } = payload;
      // 判断是否首次加载
      if (firstLoading) {
        yield put({
          type: 'firstQuery',
          payload: {
            tab,
          },
        });
      } else {
        yield put({ type: 'changeCurrentTab', tab });
        yield put({
          type: 'fetchData',
          payload: {
            jumpOrPull: 'jump',
          },
        });
      }
    },
    *firstQuery({ payload }, { call, put }) {
      const { tab } = payload;
      const queryString = {
        page: 1,
        limit: 20,
        tab,
      };
      const requestResult = yield call(fetchList, queryString);
      if (requestResult.data) {
        const result = requestResult.data;
        const { data } = result;
        yield put({
          type: 'firstQueryStateResolve',
          data,
          tab,
        });
      } else {
        throw (new Error('获取数据失败'));
      }
    },
    // 拉到底部，更新数据的时候触发的动作。 takeLatest保证数据值拉取一次。
    fetchData: [
      function* ({ payload }, { call, put, select }) {
        const { jumpOrPull } = payload;
        if (jumpOrPull === 'jump') {
          // clear state
          // ask for data
          // change state
          yield put({ type: 'clearState' });
          const list = yield select(state => state.list);
          const { currentTab, currentPage } = list;
          const queryString = {
            tab: currentTab,
            page: currentPage,
            limit: 20,
          };
          const requestResult = yield call(fetchList, queryString);
          if (requestResult.data) {
            const result = requestResult.data;
            const { data } = result;
            yield put({
              type: 'firstQueryStateResolve',
              data,
              tab: currentTab,
            });
            // 重置scrollview的属性，修复listview的Bug
            // const listScrollViewContent = document.querySelector('.am-list-view-scrollview-content');
            // listScrollViewContent.style.transform = 'translate3d(0px, 0px, 0px)';
            // console.log(listScrollViewContent.style.transform);
            const { component } = yield select(state => state.list);
            component.scrollTo(0, 0);
          } else {
            throw (new Error('获取数据失败'));
          }
        } else {
          // ask for data
          // concat data
          const list = yield select(state => state.list);
          const { currentTab } = list;
          let { currentPage } = list;
          currentPage += 1;
          const queryString = {
            tab: currentTab,
            page: currentPage,
            limit: 20,
          };
          const requestResult = yield call(fetchList, queryString);
          if (requestResult.data) {
            const result = requestResult.data;
            const { data } = result;
            yield put({
              type: 'concatNewData',
              data,
              currentPage,
            });
          } else {
            throw (new Error('获取数据失败'));
          }
        }
      },
      {
        type: 'throttle',
        ms: 2000,
      },
    ],
    refresh: [
      function* ({ payload }, { select, call, put }) {
        yield put({
          type: 'changeRefreshing',
        });
        const list = yield select(state => state.list);
        const { currentTab } = list;
        const queryString = {
          tab: currentTab,
          page: 1,
          limit: 20,
        };
        const requestResult = yield call(fetchList, queryString);
        if (requestResult.data) {
          const result = requestResult.data;
          const { data } = result;
          yield put({
            type: 'firstQueryStateResolve',
            data,
            tab: currentTab,
          });
        } else {
          throw (new Error('获取数据失败'));
        }
        yield put({
          type: 'changeRefreshing',
        });
      },
      {
        type: 'throttle',
        ms: 1000,
      },
    ],
  },

  reducers: {
    // 通过跳转进入路由时，修正路由的状态。
    // 因为前面已经changeCurrentTab，所以currentTab不用修正
    clearState(state) {
      const newState = state;
      newState.currentPage = 1;
      newState.listData = [];
      return { ...newState };
    },
    // 首次加载获取data后的操作, after firstQuery
    firstQueryStateResolve(state, action) {
      const { data, tab } = action;
      const newState = state;
      newState.currentTab = tab;
      newState.listData = data;
      newState.currentPage = 1;
      newState.firstLoading = false;
      return { ...newState };
    },
    changeCurrentTab(state, action) {
      const newState = state;
      const { tab } = action;
      newState.currentTab = tab;
      return { ...newState };
    },
    // 下拉到尽头，获取新的data,改变state的多做，改变currentPage并concat数组。
    concatNewData(state, action) {
      const { data, currentPage } = action;
      const newState = state;
      newState.currentPage = currentPage;
      const newListData = state.listData.concat(data);
      newState.listData = newListData;
      return { ...newState };
    },
    changeRefreshing(state) {
      const newState = state;
      const newRefresing = !newState.refreshing;
      newState.refreshing = newRefresing;
      return { ...newState };
    },
    addMyListToRedux(state, action) {
      const { component } = action;
      const newState = state;
      newState.component = component;
      return { ...newState };
    },
  },

};
