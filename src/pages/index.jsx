import { memo } from 'react';
import { Redirect } from 'umi';
import styles from './index.less';
export default memo(function Index() {
  return <Redirect to="/home" />;
});
