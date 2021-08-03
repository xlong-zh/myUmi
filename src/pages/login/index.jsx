import { memo } from 'react';
import { Tabs } from 'antd';
import NoteLogin from './components/NoteLogin';
import PwdLogin from './components/PwdLogin';
import styles from './index.less';

const { TabPane } = Tabs;

export default memo(function Index() {
  return (
    <div className={styles.content_box}>
      <Tabs defaultActiveKey="1" centered>
        <TabPane tab="密码登录" key="1">
          <PwdLogin />
        </TabPane>
        <TabPane tab="短信登录" key="2">
          <NoteLogin />
        </TabPane>
      </Tabs>
    </div>
  );
});
