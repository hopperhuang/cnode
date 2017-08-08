import { routerRedux } from 'dva/router';
import { fetchUserInformation, fetchUserCollection } from '../services/user';

export default {

  namespace: 'user',

  state: {},

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      history.listen((location) => {
        const { pathname } = location;
        const userReg = /^\/user\/(.+)$/;
        if (userReg.exec(pathname)) {
          const loginname = userReg.exec(pathname)[1];
          dispatch({
            type: 'fetch',
            payload: {
              loginname,
            },
          });
        }
      });
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      const { loginname } = payload;
      const informationRequestResult = yield call(fetchUserInformation, loginname);
      if (informationRequestResult.data) {
        const informationFetchResult = informationRequestResult.data;
        const informationData = informationFetchResult.data;
        const collectionRequestResult = yield call(fetchUserCollection, loginname);
        if (collectionRequestResult.data) {
          const collectionFetchResult = collectionRequestResult.data;
          const collectionData = collectionFetchResult.data;
          yield put({
            type: 'save',
            informationData,
            collectionData,
          });
        } else {
          yield put(routerRedux.push('/'));
          throw (new Error('网络或用户名错误。'));
        }
      } else {
        yield put(routerRedux.push('/'));
        throw (new Error('网络或用户名错误。'));
      }
    },
  },

  reducers: {
    save(state, action) {
      const newState = {};
      newState.informationData = action.informationData;
      newState.collectionData = action.collectionData;
      return { ...newState };
    },
    clear() {
      return {};
    },
  },

};
