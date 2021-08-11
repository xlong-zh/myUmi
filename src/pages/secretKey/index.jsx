import { useState, useEffect, memo } from 'react';
import { Alert, Button, Modal } from 'antd';
import { getSetting } from '@/services/index';
import SecretModal from './components/SecretModal';
import styles from './index.less';

export default memo(function Index() {
  const [key, setKey] = useState('');
  const [secret, setSecret] = useState('');
  const [show, setShow] = useState(false);
  const [modalType, setModalType] = useState('');

  useEffect(() => {
    getInfo();
  }, []);

  const getInfo = async () => {
    try {
      const {
        data: { secret, key },
      } = await getSetting({ type: 3 });
      setKey(key);
      setSecret(secret);
    } catch (error) {
      setKey('');
      setSecret('');
    }
  };

  const getSecret = (value) => {
    setSecret(value);
    setShow(true);
    setModalType('');
  };

  return (
    <div className={styles.secretKey}>
      <Alert
        type="info"
        className={styles.alert}
        message="提示：在调用开放接口时，需要通过应用密钥（可修改）生成签名串，只有验签通过后开放接口才允许访问"
      />
      <div className={styles.line}>
        <label>AppKey-商户KEY</label>
        <p>{key || '--'}</p>
      </div>
      <div className={styles.line}>
        <label>AppSecret-商户密钥</label>
        <p>{secret || '--'}</p>
      </div>
      <div className={styles.line}>
        {((secret && !show) || !secret) && (
          <Button type="primary" size="large" style={{ marginRight: 20 }} onClick={() => setModalType('show')}>
            显示密钥
          </Button>
        )}
        <Button size="large" onClick={() => setModalType('reset')}>
          重置密钥
        </Button>
      </div>
      {!!modalType && <SecretModal type={modalType} getSecret={getSecret} onCancel={() => setModalType('')} />}
    </div>
  );
});
