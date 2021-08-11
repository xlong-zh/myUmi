import Axios from 'axios';
import { history } from 'umi';
import json2formdata from 'json2formdata';
import Cookie from 'js-cookie';
import { message } from 'antd';
import { createSignature, obj2url } from './index';

const TIME_OUT = 5000; // 请求超时时间
// const BASE_URL = 'http://test.openapi.huarongxunfang.com'; //接口域名
const BASE_URL = 'https://openapi.huarongxunfang.com'; //接口域名

// axios请求默认配置
const defineConfig = {
  timeout: TIME_OUT,
  withCredentials: true,
  baseURL: BASE_URL,
};
// 添加请求拦截器
Axios.interceptors.request.use(
  (config) => config,
  (error) => {
    return Promise.reject(error);
  },
);

// 添加响应拦截器
Axios.interceptors.response.use(
  (res) => res?.data || {},
  (error) => {
    return Promise.reject(error);
  },
);

// 处理错误
function handleErr(err) {
  if (typeof err === 'object') {
    if (Axios.isCancel(err)) return;
    if ((err?.message || '').includes('timeout')) {
      return message.error('请求超时');
    }
    const { codeError = false, msg = '请求出错' } = err;
    if (codeError) return message.error(msg);
    return message.error(err.toString());
  }
  message.error(err);
}

// code码处理
function resIntercept(res) {
  const { code } = res;
  if (code === 1) {
    return res;
  }
  if (code === 3) return toLogin();
  return Promise.reject({ ...res, codeError: true });
}

function toLogin() {
  const { pathname } = window.location;
  history.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
}

export default function http(url, config = {}) {
  const cacheKey = url + JSON.stringify(config);

  if (http.cache[cacheKey]) {
    return http.cache[cacheKey];
  }

  // 默认为token验证请求，登录注册部分接口走signature验证，需显式传入type
  const { data, method = 'get', type = 'token' } = config;

  if (type === 'signature') {
    const signatureObj = createSignature(data);
    config.headers = {
      ...signatureObj,
    };
  } else {
    const cookieToken = Cookie.get('token');
    const token = cookieToken || 'b00a98f09272d2ff6ede4be453c58571';
    config.headers = {
      usertoken: token,
    };
  }

  if (method === 'get') {
    config.params = data;
    config.paramsSerializer = (params) => obj2url(params);
  } else {
    config.data = json2formdata(data);
  }

  const instance = Axios(url, { ...defineConfig, ...config })
    .then((res) => resIntercept(res))
    .catch((err) => {
      handleErr(err);
      return Promise.reject();
    })
    .finally(() => {
      delete http.cache[cacheKey];
    });

  return (http.cache[cacheKey] = instance);
}

http.cache = {};
