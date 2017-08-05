export default function resolveDate(string) {
  return new Date(string).toString().split(' ').splice(1, 3)
  .join('-');
}
