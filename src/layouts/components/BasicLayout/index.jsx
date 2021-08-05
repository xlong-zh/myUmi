import { memo, useState, useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Layout } from 'antd';
import SideBar from '../SideBar';
import Header from '../Header';
import Bred from '../Bred';
import styles from './index.less';

const { Content } = Layout;

export default memo(function Index({ children }) {
  const [done, setDone] = useState(false);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch({
      type: 'app/getUserInfo',
      callback: () => {
        setDone(true);
      },
    });
  }, []);

  return (
    done && (
      <Layout style={{ minHeight: '100vh', minWidth: 1200 }}>
        <SideBar />
        <Layout>
          <Header />
          <Bred />
          <Content className={styles.content}>
            <div className={styles.pageBody} id="pageBody">
              {children}
            </div>
          </Content>
        </Layout>
      </Layout>
    )
  );
});
