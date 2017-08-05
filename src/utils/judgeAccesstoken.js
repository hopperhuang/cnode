export default function judgeAccesstoken() {
  const accesstoken = localStorage.getItem('cnode-accesstoken');
  return !!accesstoken;
}
