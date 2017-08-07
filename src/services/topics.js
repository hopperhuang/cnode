import request from '../utils/request';

export async function postTopics(params) {
  const url = '/api/topics';
  return request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...params,
    }),
  });
}
export async function editTopics(params) {
  const url = '/api/topics/update';
  return request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...params,
    }),
  });
}
