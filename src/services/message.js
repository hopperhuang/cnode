import request from '../utils/request';

export async function fetchMessage(accesstoken) {
  const url = `/api/messages?accesstoken=${accesstoken}`;
  return request(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function markOneMessage(params) {
  const { id, accesstoken } = params;
  const url = `/api/message/mark_one/${id}`;
  return request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      accesstoken,
    }),
  });
}
export async function markAllMessage(accesstoken) {
  const url = '/api/message/mark_all';
  return request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      accesstoken,
    }),
  });
}
