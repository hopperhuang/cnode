// import { routerRedux } from 'dva/router';
import fetchList from '../services/list';

// 通过subscriptions 监听/路径。
// 进入路由就会根据queryString.tab,来做判断
// 如果tab为空或者all,则fetch 拉取全部的内容
// 如果tab为其他，则根据相应的tab内容来拉取内容。
export default {

  namespace: 'list',

  state: {
    currentTab: 'all',
    currentPage: 1,
    listData: [[]],
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      // 监听 "/"路径，然后获取queryString中的tab,
      // 发出query动作，拉取信息。
      history.listen((location) => {
        const { pathname } = location;
        if (pathname === '/') {
          const { query } = location;
          const { tab } = query;
          const queryStringTab = tab === undefined && 'all' ? 'all' : tab;
          dispatch({
            type: 'initializeState',
          });
          dispatch({
            type: 'query',
            payload: {
              tab: queryStringTab,
            },
          });
        }
      });
    },
  },

  effects: {
    // 开始进入时触发的动作。
    *query({ payload }, { call, put }) {  // eslint-disable-line
      const { tab } = payload;
      let { page, limit } = payload;
      page = page === undefined ? 1 : page;
      limit = limit === undefined ? 20 : limit;
      const queryString = { tab, page, limit };
      const requestResult = yield call(fetchList, queryString);
      if (requestResult.data) {
        const result = requestResult.data;
        const { data } = result;
        yield put({
          type: 'getPageData',
          data,
          tab,
        });
      } else {
        throw (new Error('获取数据失败'));
      }
    },
    // 拉到底部，更新数据的时候触发的动作。
    *fetchNewData({ payload }, { call, put, select }) {
      const list = yield select(state => state.list);
      console.log(list);
      const { currentTab } = list;
      let { currentPage } = list;
      currentPage += 1;
      const limit = 20;
      const queryString = {
        tab: currentTab,
        page: currentPage,
        limit,
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
    },
  },

  reducers: {
    // 进入路由时，初始化状态的动作。
    initializeState(state) {
      const newState = state;
      newState.currentTab = 'laoding';
      newState.currentPage = 1;
      newState.listData = [];
      return { ...newState };
    },
    // 首次获取data后改变state的动作
    getPageData(state, action) {
      const { data, tab } = action;
      const newState = state;
      newState.currentTab = tab;
      newState.listData = data;
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
  },

};
