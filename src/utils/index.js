import { API_KEY } from '@/config';
import qs from 'qs';
import md5 from 'js-md5';
// 获取签名
export function createSignature(data) {
  const timestamp = Date.now();
  data = {
    ...data,
    timestamp,
    api_key: API_KEY,
  };
  const url = decodeURI(qs.stringify(sortObj(data)));
  return {
    signature: md5(md5(url)),
    timestamp,
  };
}
// 给对象进行字典排序(js自动排序)
function sortObj(obj = {}) {
  const newObj = {};
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      newObj[key] = obj[key];
    });
  return newObj;
}
// 参数序列化
export function obj2url(obj) {
  let url = '';
  (Object.keys(obj) || []).forEach((ele) => {
    url += `${ele}=${obj[ele] || ''}&`;
  });
  return url.slice(0, url.length - 1);
}
// 根据path获取当前路由和父节点
export function getBredName(data = [], pathname, parentName) {
  for (const i of data) {
    if (pathname === i.path) return parentName ? [i.name, parentName] : [i.name];
    if (i.children && i.children.length > 0) {
      const [findName, openName] = getBredName(i.children, pathname, i.name) || [];
      if (findName) return [findName, openName];
      continue;
    }
  }
  return [];
}
