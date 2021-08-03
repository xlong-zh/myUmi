import { memo, useState, useImperativeHandle } from 'react';
import { Input, Button } from 'antd';
import useCountDown from '@/hooks/useCountDown';

import styles from './index.less';

export default memo(function Index({ value, onChange, cref, sendCode }) {
  const [loading, setLoading] = useState(false);
  const { countNum, counting, startCount } = useCountDown();

  useImperativeHandle(cref, () => ({
    count: startCount,
    setLoading,
  }));

  return (
    <>
      <Input placeholder="请输入验证码" className={styles.code} value={value} maxLength={4} onChange={onChange} />
      <Button className={styles.code_btn} onClick={sendCode} disabled={counting} loading={loading}>
        {counting ? `${countNum}s` : '获取验证码'}
      </Button>
    </>
  );
});
