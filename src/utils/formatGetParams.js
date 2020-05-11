export function paramObjToString(obj) {
  return Object.keys(obj)
    .filter(key => obj[key] !== undefined)
    .reduce((str, item) => `${str}&${item}=${obj[item]}`, '')
    .substr(1);
}

export function paramStringToObj(string) {
  return string
    .split('&')
    .map(item => ({ [item.split('=')[0]]: item.split('=')[1] }))
    .reduce((obj, curr) => ({ ...obj, ...curr }), {});
}
