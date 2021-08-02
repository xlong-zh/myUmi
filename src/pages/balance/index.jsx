import { memo } from 'react';
import styles from './index.less';
import { Button } from 'antd';
import { history } from 'umi';

export default memo(function Index() {
  return (
    <div>
      <div>
        <Button type="primary" size="small" onClick={() => history.push('/home')}>
          查看
        </Button>
      </div>
    </div>
  );
});
