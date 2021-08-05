import { memo } from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { useLocation } from 'umi';
import { LOG_IN } from '@/config/index';
import BasicLayout from './components/BasicLayout';
import './base.less';

export default memo(function Index(props) {
  const { pathname } = useLocation();
  // 匹配所有登录注册页面
  const pattern = new RegExp(`^${LOG_IN}.*`);
  const isLoginPage = pattern.test(pathname);

  return <ConfigProvider locale={zhCN}>{isLoginPage ? props.children : <BasicLayout {...props} />}</ConfigProvider>;
});
