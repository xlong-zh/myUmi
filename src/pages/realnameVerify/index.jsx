import { useEffect, useMemo } from 'react';
import { Alert, Tabs } from 'antd';
import Enterprise from './components/Enterprise';
import Personal from './components/Personal';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import styles from './index.less';

const { TabPane } = Tabs;

export default function Index() {
  const dispatch = useDispatch();
  const { authInfo, userInfo } = useSelector((state) => state.app, shallowEqual);

  useEffect(() => {
    return () => {
      const dom = document.getElementById('pageBody');
      if (dom) {
        dom.style.overflow = 'scroll';
      }
    };
  }, []);

  const getInfo = async () => {
    await dispatch({
      type: 'app/getUserInfo',
    });
    setInfo(authInfo);
  };

  const content = useMemo(() => {
    const type = authInfo?.type || '';
    const auth_status = userInfo?.auth_status;

    if (!type || ['-1', '2'].includes(`${auth_status}`)) {
      return (
        <>
          <TabPane tab="企业实名认证" key="0">
            <Enterprise info={authInfo} flush={getInfo} />
          </TabPane>
          <TabPane tab="个人实名认证" key="1">
            <Personal info={authInfo} flush={getInfo} />
          </TabPane>
        </>
      );
    }
    const dom = document.getElementById('pageBody');
    if (dom) {
      dom.scrollTop = 0;
      dom.style.overflow = 'hidden';
    }

    if (type === '1') {
      return (
        <TabPane tab="企业实名认证" key="0">
          <Enterprise info={authInfo} flush={getInfo} />
        </TabPane>
      );
    }
    return (
      <TabPane tab="个人实名认证" key="1">
        <Personal info={authInfo} flush={getInfo} />
      </TabPane>
    );
  }, [authInfo, userInfo]);

  return (
    <div style={{ padding: 20, position: 'relative' }}>
      {authInfo === null && (
        <Alert message="您尚未进行认证：请选择并填写" type="info" showIcon className={styles.alert} />
      )}
      {authInfo === '' ? null : <Tabs className={styles.tabs}>{content}</Tabs>}
      {['0', '1'].includes(`${userInfo?.auth_status}`) && (
        <div className={styles.mask}>
          {`${userInfo?.auth_status}` === '0' ? '审核中' : `${userInfo?.auth_status}` === '1' ? '已认证通过' : ''}
        </div>
      )}
    </div>
  );
}
