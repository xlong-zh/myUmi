import http from '@/utils/http';

// 注册
export const register = (data) =>
  http('/login/register', {
    type: 'signature',
    data,
    method: 'post',
  });

// 密码登录
export const pwdLogin = (data) =>
  http('/login/pwdLogin', {
    type: 'signature',
    data,
    method: 'post',
  });

// 验证码登录
export const codeLogin = (data) =>
  http('/login/codeLogin', {
    type: 'signature',
    data,
    method: 'post',
  });

// 忘记密码
export const updatePwd = (data) =>
  http('/login/doForget', {
    type: 'signature',
    data,
    method: 'post',
  });

// 发送验证码
export const sendVerifyCode = (data) =>
  http('/tool/doSendMsg', {
    type: 'signature',
    data,
    method: 'post',
  });

// 发送验证码(无需手机号)
export const sendVerifyCodeNoPhone = (data) => http('/tool/doSendUserMsg');

// 修改密码
export const doChangePwd = (data) =>
  http('/user/doChangePwd', {
    data,
  });

// 获取用户信息
export const getUserInfo = () => http('/user/getInfo');

// 上传图片
export const uploadPic = (data) =>
  http('/tool/uploadImg', {
    data,
    method: 'post',
  });

// 余额列表
export const balanceList = (data) =>
  http('/user/getLogList', {
    data,
    method: 'get',
  });
// 商品分类
export const productSort = (data) =>
  http('/product/getCategory', {
    data,
    method: 'get',
  });

//设置用户信息
export const setInfo = (data) =>
  http('/user/setInfo', {
    data,
    method: 'post',
  });

// 获取用户配置
export const getSetting = (data) => http('/user/getSetting', { data });

// 短信通知设置
export const setNotice = (data) =>
  http('/user/setNotice', { data, method: 'post' });

// 显示密钥
export const getSecret = (data) =>
  http('/user/getSecret', { data, method: 'post' });

// 重置密钥
export const resetSecret = (data) =>
  http('/user/resetSecret', { data, method: 'post' });

//提交认证
export const doAuth = (data) => http('/user/doAuth', { data, method: 'post' });

// 获取认证
export const getAuthInfo = () => http('/user/getAuthInfo');
