import { memo, useRef, useState, useMemo, useEffect } from 'react';
import { Dropdown, Avatar, Button } from 'antd';
import { history } from 'umi';
import Cookie from 'js-cookie';
import { useSelector, shallowEqual } from 'react-redux';
import { UserOutlined } from '@ant-design/icons';
import ChangePwd from '@/components/ChangePwd';
import styles from './index.less';

export default memo(function Index() {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [modal, setModal] = useState(false);
  const container = useRef(null);
  const { userInfo } = useSelector((state) => state.app, shallowEqual);

  useEffect(() => {
    if (userInfo?.phone) {
      setPhone(userInfo?.phone);
      setAmount(userInfo?.amount);
    }
  }, [userInfo]);

  function handleQuit() {
    Cookie.remove('token', { domain: '.huarongxunfang.com' });
    history.push('/login');
  }

  const overlay = useMemo(() => {
    const dotIndex = amount.indexOf('.');
    let beforeDot, afterDot;
    if (dotIndex < 0) {
      beforeDot = amount;
      afterDot = '';
    } else {
      beforeDot = amount.slice(0, dotIndex);
      afterDot = amount.slice(dotIndex, amount.length);
    }
    return (
      <>
        <p>余额:</p>
        <div className={styles.moneyBox}>
          <div className={styles.money}>
            <span style={{ fontSize: 20 }}>￥</span>
            <span style={{ fontSize: 32 }}>{beforeDot}</span>
            <span style={{ fontSize: 18 }}>{afterDot}</span>
          </div>
          <Button type="primary" size="small" onClick={() => history.push('/balance')} className={styles.watchBtn}>
            查看
          </Button>
        </div>
        <div className={styles.editPwd} onClick={() => setModal(true)}>
          修改密码
        </div>
        <div className={styles.logout} onClick={handleQuit}>
          退出
        </div>
      </>
    );
  }, [amount]);

  return (
    <>
      <Dropdown overlay={overlay} getPopupContainer={() => container.current} overlayClassName={styles.overlay}>
        <div className={styles.avatarWrapper} ref={container}>
          <Avatar icon={<UserOutlined />} className={styles.avatar} />
          <span>{phone}</span>
        </div>
      </Dropdown>
      {modal && <ChangePwd onCancel={() => setModal(false)} />}
    </>
  );
});
