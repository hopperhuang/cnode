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
