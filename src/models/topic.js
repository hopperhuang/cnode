import { routerRedux } from 'dva/router';
import {
  fetchTopic,
  submitTopicComment,
  deCollectOneTopic,
  collectOneTopic,
  upOneReply,
 } from '../services/topic';

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
      } else {
        yield put(routerRedux.push(`/topic/${topicId}`));
        throw (new Error('提交评论失败'));
      }
    },
    *deCollectTopic({ payload }, { call, put, select }) {
      const { topicId } = yield select(state => state.topic);
      const accesstoken = localStorage.getItem('cnode-accesstoken');
      const params = { topicId, accesstoken };
      const requestResult = yield call(deCollectOneTopic, params);
      if (requestResult.data) {
        yield put(routerRedux.push(`/topic/${topicId}`));
      } else {
        yield put(routerRedux.push(`/topic/${topicId}`));
        throw (new Error('网络错误，取消收藏失败'));
      }
    },
    *collectTopic({ payload }, { call, put, select }) {
      const { topicId } = yield select(state => state.topic);
      const accesstoken = localStorage.getItem('cnode-accesstoken');
      const params = { topicId, accesstoken };
      const requestResult = yield call(collectOneTopic, params);
      if (requestResult.data) {
        yield put(routerRedux.push(`/topic/${topicId}`));
      } else {
        yield put(routerRedux.push(`/topic/${topicId}`));
        throw (new Error('网络错误，收藏失败'));
      }
    },
    *upReplies({ payload }, { call, put, select }) {
      const { topicId } = yield select(state => state.topic);
      const accesstoken = localStorage.getItem('cnode-accesstoken');
      const { reply_id } = payload;
      const params = {
        accesstoken,
        reply_id,
      };
      const requestResult = yield call(upOneReply, params);
      if (requestResult.data) {
        yield put(routerRedux.push(`/topic/${topicId}`));
      } else {
        yield put(routerRedux.push(`/topic/${topicId}`));
        throw (new Error('不能为自己点赞，或者网络错误'));
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
