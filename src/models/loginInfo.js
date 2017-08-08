import { routerRedux } from 'dva/router';
import update from 'immutability-helper';
import fetchLogin, { fetchUnreadMessageCount } from '../services/login.js';

// 流程判断
// 1. history.linten --> queryAccesstoken
// 2.accesstoken 不存在
// 2.1登录的是普通压面，停留
// 2.2登录的是权限页面，跳转回IndexPage
// 3.accesstoken 存在
// 3.1 token存在，进入不需要权限的页面（如：登陆页）直接跳回IndexPage
// 3.2 token存在，本地信息存在，进入需要权限的页面或普通页面，直接进入，不发生任何动作。
// 3.3 token存在，本地信息不存在，通过token,fetchLogin拉取个人信息到本地，然后跳转到目标页面。
export default {

  namespace: 'loginInfo',

  state: {
    success: false,
    information: null,
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      // 这里做访问权限控制
      // history.listen....
      // 1.搜索本地保存的accesstoken，有则显示登录状态的页面（个人中心）
      // 2.跳转的地址是否为需要下权限的地址，personalCenter等，如果是，在没有权限的情况下
      // 跳回IndexPage。
      history.listen((location) => {
        const { pathname } = location;
        dispatch({
          type: 'queryAccesstoken',
          payload: {
            pathname,
          },
        });
      });
    },
  },

  effects: {
    *logout({ payload }, { call, put }) {  // eslint-disable-line
      localStorage.removeItem('cnode-accesstoken');
      localStorage.removeItem('cnode-personalID');
      yield put({ type: 'clearInformation' });
      yield put(routerRedux.push('/'));
    },
    *login({ payload }, { call, put }) {
      const { accesstoken } = payload;
      const loginResult = yield call(fetchLogin, accesstoken);
      if (loginResult.data) {
        const loginInfo = loginResult.data;
        const unReadMessageRequest = yield call(fetchUnreadMessageCount, accesstoken);
        if (unReadMessageRequest.data) {
          const unReadMessageRequestResult = unReadMessageRequest.data;
          const unReadCount = unReadMessageRequestResult.data;
          loginInfo.unReadCount = unReadCount;
          localStorage.setItem('cnode-accesstoken', accesstoken);
          localStorage.setItem('cnode-personalID', loginInfo.id);
          yield put({ type: 'addInformation', loginInfo });
          yield put(routerRedux.push('/'));
        } else {
          yield put(routerRedux.push('/'));
          throw (new Error('网络错误'));
        }
        // localStorage.setItem('cnode-accesstoken', accesstoken);
        // localStorage.setItem('cnode-personalID', loginInfo.id);
        // yield put({ type: 'addInformation', loginInfo });
        // yield put(routerRedux.push('/'));
      } else {
        throw (new Error('未通过验证'));
      }
    },
    *queryAccesstoken({ payload }, { call, put, select }) {
      const accesstoken = localStorage.getItem('cnode-accesstoken');
      if (accesstoken) {
        // 流程跳转控制
        // 3.1 已登录的情况下进入不需要权限的页面。
        const { pathname } = payload;
        if (pathname === '/login') {
          yield put(routerRedux.push('/'));
          throw (new Error('你已经登录了'));
        }
        // 流程跳转控制
        const informationExist = yield select(state => state.loginInfo.success);
        // information个人信息已存在请情况下，app内部路由跳转。
        // 3.2 token存在,本地信息存在的情况下，不发生fetchLogin动作。
        if (informationExist) {
          return;
        }
        // 3.3 token存在，本地信息不存在的情况下，fetchLogin拉取信息，更改本地state，前往目标页面。
        const loginResult = yield call(fetchLogin, accesstoken);
        const loginInfo = loginResult.data;
        const unReadCount = yield call(fetchUnreadMessageCount, accesstoken);
        loginInfo.unReadCount = unReadCount.data.data;
        yield put({ type: 'addInformation', loginInfo });
      } else {
        const { pathname } = payload;
        // 这里做未登录情况下的权限控制。
        // 2.2登录的是权限页面，跳转回IndexPage
        if (pathname === '/topics') {
          yield put(routerRedux.push('/'));
          throw (new Error('无权进入该页面,请先登录'));
        }
        if (pathname === '/update') {
          yield put(routerRedux.push('/'));
          throw (new Error('无权进入该页面,请先登录'));
        }
        if (pathname === '/message') {
          yield put(routerRedux.push('/'));
          throw (new Error('无权进入该页面,请先登录'));
        }
      }
    },
    *refreshUnreadCount({ payload }, { call, put }) {
      console.log('refresh');
      const { topicID } = payload;
      const accesstoken = localStorage.getItem('cnode-accesstoken');
      const requestResult = yield call(fetchUnreadMessageCount, accesstoken);
      if (requestResult.data) {
        const { data } = requestResult;
        const unReadCount = data.data;
        if (topicID) {
          yield put({
            type: 'changeUnreadCount',
            unReadCount,
          });
          yield put(routerRedux.push(`/topic/${topicID}`));
        } else {
          yield put({
            type: 'changeUnreadCount',
            unReadCount,
          });
          yield put(routerRedux.push('/message'));
        }
      } else {
        throw (new Error('网络错误'));
      }
    },
  },

  reducers: {
    clearInformation(state) {
      const newState = state;
      newState.success = false;
      newState.information = null;
      return { ...newState };
    },
    addInformation(state, action) {
      const { loginInfo } = action;
      const newState = state;
      newState.information = loginInfo;
      newState.success = true;
      return { ...newState };
    },
    changeUnreadCount(state, action) {
      const { unReadCount } = action;
      console.log(unReadCount);
      const newState = update(state, {
        information: {
          unReadCount: { $set: unReadCount },
        },
      });
      return newState;
    },
  },

};
