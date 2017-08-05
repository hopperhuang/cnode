import { routerRedux } from 'dva/router';
import { fetchTopic, submitTopicComment } from '../services/topic';

console.log(submitTopicComment);
export default {

  namespace: 'topic',

  state: {
    topicId: '',
    topicData: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      history.listen((location) => {
        const { pathname } = location;
        const regExp = /^\/topic\/(.+)/;
        const result = regExp.exec(pathname);
        if (result) {
          const topicId = result[1];
          dispatch({
            type: 'fetchTopicData',
            payload: {
              topicId,
            },
          });
        }
      });
    },
  },

  effects: {
    *fetchTopicData({ payload }, { call, put }) {
      const { topicId } = payload;
      const accesstoken = localStorage.getItem('cnode-accesstoken');
      const queryString = accesstoken ? { topicId, accesstoken } : { topicId };
      const requestResult = yield call(fetchTopic, queryString);
      if (requestResult.data) {
        const result = requestResult.data;
        const { data } = result;
        yield put({
          type: 'saveData',
          data,
          topicId,
        });
      } else {
        throw (new Error('获取数据失败'));
      }
    },
    *submitComment({ payload }, { select, call, put }) {
      const { topicId } = yield select(state => state.topic);
      const accesstoken = localStorage.getItem('cnode-accesstoken');
      const { content, reply_id } = payload;
      const params = {
        topicId,
        accesstoken,
        content,
        reply_id,
      };
      const requestResult = yield call(submitTopicComment, params);
      if (requestResult.data) {
        yield put(routerRedux.push(`/topic/${topicId}`));
        console.log('重新进入这个帖子');
      } else {
        yield put(routerRedux.push(`/topic/${topicId}`));
        throw (new Error('提交评论失败'));
      }
    },
  },

  reducers: {
    clearData(state) {
      const newState = state;
      newState.topicData = {};
      newState.topicId = '';
      return { ...newState };
    },
    saveData(state, action) {
      const { data, topicId } = action;
      const newState = state;
      newState.topicData = data;
      newState.topicId = topicId;
      return { ...newState };
    },
  },

};
