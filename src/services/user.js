import request from '../utils/request';

export async function fetchUserInformation(loginname) {
  const url = `/api/user/${loginname}`;
  return request(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function fetchUserCollection(loginname) {
  const url = `/api/topic_collect/${loginname}`;
  return request(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
