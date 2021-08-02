import { memo, useLayoutEffect, useRef } from 'react';
// import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Layout, Spin } from 'antd';
import SideBar from '../SideBar';
import Header from '../Header';
import Bred from '../Bred';
import styles from './index.less';

const { Content } = Layout;

export default memo(function Index({ children }) {
  // const firstLoaded = useRef(false);
  // const dispatch = useDispatch();
  // const { loading } = useSelector((state) => state.app, shallowEqual);
  // useLayoutEffect(() => {
  //   dispatch({ type: 'app/getUderInfo' });
  // }, []);

  return (
    <Layout style={{ minHeight: '100vh', minWidth: 1200 }}>
      <SideBar />
      <Layout>
        <Header />
        <Bred />
        <Content className={styles.content}>
          <div className={styles.pageBody}>
            <Spin spinning={false}>{children}</Spin>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
});
