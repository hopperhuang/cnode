import request from '../utils/request';

export default async function fetchLogin(accesstoken) {
  return request('/api/accesstoken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      accesstoken,
    }),
  });
}
export async function fetchUnreadMessageCount(accesstoken) {
  const url = `/api/message/count?accesstoken=${accesstoken}`;
  return request(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
