import request from '../utils/request';

export default async function fetchList(queryString) {
  const { tab, page, limit } = queryString;
  const url = tab === 'all' ? `/api/topics?page=${page}&limit=${limit}` :
  `/api/topics?tab=${tab}&page=${page}&limit=${limit}`;
  return request(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
