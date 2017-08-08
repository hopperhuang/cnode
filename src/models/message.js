import { routerRedux } from 'dva/router';
import { fetchMessage, markOneMessage, markAllMessage } from '../services/message';

export default {

  namespace: 'message',

  state: {},

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      history.listen((location) => {
        const { pathname } = location;
        if (pathname === '/message') {
          const accesstoken = localStorage.getItem('cnode-accesstoken');
          dispatch({
            type: 'fetch',
            payload: {
              accesstoken,
            },
          });
        }
      });
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      const { accesstoken } = payload;
      const requestResult = yield call(fetchMessage, accesstoken);
      if (requestResult.data) {
        const result = requestResult.data;
        const { data } = result;
        yield put({
          type: 'save',
          data,
        });
      } else {
        yield put(routerRedux.push('/'));
        throw (new Error('网络错误!'));
      }
    },
    *markOneMessage({ payload }, { call, put }) {
      const { messgeId, topicID } = payload;
      const accesstoken = localStorage.getItem('cnode-accesstoken');
      const params = { accesstoken, id: messgeId };
      const requestResult = yield call(markOneMessage, params);
      if (requestResult.data) {
        // 更新未读消息信息
        if (topicID) {
          yield put({
            type: 'loginInfo/refreshUnreadCount',
            payload: {
              topicID,
            },
          });
        } else {
          yield put({
            type: 'loginInfo/refreshUnreadCount',
            payload: {},
          });
        }
      } else {
        throw (new Error('网络错误'));
      }
    },
    *markAllMessage({ payload }, { call, put }) {
      const accesstoken = localStorage.getItem('cnode-accesstoken');
      const requestResult = yield call(markAllMessage, accesstoken);
      if (requestResult.data) {
        yield put({
          type: 'loginInfo/refreshUnreadCount',
          payload: {},
        });
      } else {
        throw (new Error('网络错误，请检查网络'));
      }
    },
  },

  reducers: {
    save(state, action) {
      const newState = {};
      newState.data = action.data;
      return { ...newState };
    },
    clear() {
      return {};
    },
  },

};
