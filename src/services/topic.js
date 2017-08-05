import request from '../utils/request';

export async function fetchTopic(queryString) {
  const { topicId, accesstoken } = queryString;
  const url = accesstoken ? `/api/topic/${topicId}?accesstoken=${accesstoken}` :
  `/api/topic/${topicId}`;
  return request(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function submitTopicComment(params) {
  const { accesstoken, content, reply_id, topicId } = params;
  const url = `/api/topic/${topicId}/replies`;
  const body = reply_id ? JSON.stringify({ accesstoken, content, reply_id }) :
  JSON.stringify({ accesstoken, content });
  return request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });
}
