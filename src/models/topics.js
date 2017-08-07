import { routerRedux } from 'dva/router';
import { postTopics, editTopics } from '../services/topics';
import { fetchTopic } from '../services/topic';

export default {

  namespace: 'topics',

  state: {},

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      history.listen((location) => {
        const { pathname, query } = location;
        if (pathname === '/update') {
          dispatch({
            type: 'queryAuthonrize',
            payload: {
              topicId: query.topicId,
            },
          });
        }
      });
    },
  },

  effects: {
    *postYourWrite({ payload }, { call, put }) {  // eslint-disable-line
      const accesstoken = localStorage.getItem('cnode-accesstoken');
      const params = {
        accesstoken,
        ...payload,
      };
      const requestResult = yield call(postTopics, params);
      if (requestResult.data) {
        const result = requestResult.data;
        const { topic_id } = result;
        yield put(routerRedux.push(`/topic/${topic_id}`));
      } else {
        throw (new Error('网络错误，提交失败！'));
      }
    },
    *queryAuthonrize({ payload }, { call, put }) {
      const userID = localStorage.getItem('cnode-personalID');
      const { topicId } = payload;
      const queryString = { topicId };
      const requestResult = yield call(fetchTopic, queryString);
      if (requestResult.data) {
        const result = requestResult.data;
        const { data } = result;
        data.topicId = topicId;
        const { author_id } = data;
        if (author_id === userID) {
          yield put({
            type: 'saveData',
            data,
          });
        } else {
          yield put(routerRedux.push('/'));
          throw (new Error('你无权进行此操作！'));
        }
      } else {
        yield put(routerRedux.push('/'));
        throw (new Error('网络错误'));
      }
    },
    *editYourWrite({ payload }, { call, put, select }) {
      const accesstoken = localStorage.getItem('cnode-accesstoken');
      const topic_id = yield select(state => state.topics.topicId);
      const params = {
        accesstoken,
        topic_id,
        ...payload,
      };
      const requestResult = yield call(editTopics, params);
      if (requestResult.data) {
        yield put(routerRedux.push(`/topic/${topic_id}`));
      } else {
        throw (new Error('网络错误，提交失败！'));
      }
    },
  },

  reducers: {
    saveData(state, action) {
      const { data } = action;
      const { content, title, tab, topicId } = data;
      const newState = {
        content,
        title,
        tab,
        topicId,
      };
      return newState;
    },
    clearState() {
      return {};
    },
  },

};
