import { memo, useEffect, useState } from 'react';
import { Modal, Spin } from 'antd';
import { agreementContent } from '@/services/index';
import styles from './index.less';

export default memo(function Index({ code, ...rest }) {
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState('false');

  useEffect(() => {
    getData({ code });
  }, [code]);

  const getData = async (data) => {
    setLoading(true);
    try {
      const res = await agreementContent(data);
      setInfo(res.data?.content || '');
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <Modal visible={true} width={720} className={styles.modal} {...rest}>
      <Spin spinning={loading}>
        <div className={styles.modalBody} dangerouslySetInnerHTML={{ __html: info }}></div>
      </Spin>
    </Modal>
  );
});
