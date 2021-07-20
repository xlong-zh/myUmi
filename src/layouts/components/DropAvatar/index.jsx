import { useMemo, useRef, useState, useEffect } from 'react';
import { Dropdown, Avatar, Button } from 'antd';
import { useSelector, shallowEqual } from 'react-redux';
import { UserOutlined } from '@ant-design/icons';
import ChangePwd from '@/components/ChangePwd';
import styles from './index.less';

export default useMemo(
  () =>
    function Index(props) {
      const [phone, setPhone] = useState('');
      const container = useRef(null);
      const [modal, setModal] = useState(false);
      const { userInfo } = useSelector((state) => state.app, shallowEqual);

      const overlay = (
        <>
          <p>余额:</p>
          <div className={styles.moneyBox}>
            <div className={styles.money}>
              <span style={{ fontSize: 20 }}>￥</span>
              <span style={{ fontSize: 32 }}>0.</span>
              <span style={{ fontSize: 18 }}>0000</span>
            </div>
            <Button type="primary" size="small" className={styles.watchBtn}>
              查看
            </Button>
          </div>
          <div className={styles.editPwd} onClick={() => setModal(true)}>
            修改密码
          </div>
          <div className={styles.logout}>退出</div>
        </>
      );

      useEffect(() => {
        if (userInfo?.phone) setPhone(userInfo?.phone);
      }, [userInfo]);

      return (
        <>
          <Dropdown overlay={overlay} getPopupContainer={() => container.current} overlayClassName={styles.overlay}>
            <div className={styles.avatarWrapper} ref={container}>
              <Avatar icon={<UserOutlined />} className={styles.avatar} />
              <span>{phone}</span>
            </div>
          </Dropdown>
          {/* {modal && <ChangePwd onCancel={() => setModal(false)} />} */}
        </>
      );
    },
);
