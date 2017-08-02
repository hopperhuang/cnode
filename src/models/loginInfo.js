import { routerRedux } from 'dva/router';
import fetchLogin from '../services/login.js';

export default {

  namespace: 'loginInfo',

  state: {
    accesstoken: null,
    information: null,
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      // 这里做访问权限控制
      // history.listen....
      // 1.搜索本地保存的accesstoken，有则显示登录状态的页面（个人中心）
      // 2.跳转的地址是否为需要下权限的地址，personalCenter等，如果是，在没有权限的情况下
      // 跳回IndexPage。
    },
  },

  effects: {
    *logout({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'clearInformation' });
    },
    *login({ payload }, { call, put }) {
      const { accesstoken } = payload;
      const loginResult = yield call(fetchLogin, accesstoken);
      if (loginResult.data) {
        const loginInfo = loginResult.data;
        yield put({ type: 'addInformation', loginInfo, accesstoken });
        yield put(routerRedux.push('/'));
      } else {
        throw (new Error('未通过验证'));
      }
    },
  },

  reducers: {
    clearInformation(state) {
      const newState = state;
      newState.accesstoken = null;
      newState.information = null;
      return { ...newState };
    },
    addInformation(state, action) {
      const { loginInfo, accesstoken } = action;
      const newState = state;
      newState.information = loginInfo;
      newState.accesstoken = accesstoken;
      return { ...newState };
    },
  },

};
