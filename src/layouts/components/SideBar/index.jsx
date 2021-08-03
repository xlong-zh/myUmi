import { useState, memo, useMemo, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { useHistory, useLocation } from 'umi';
import { menuEnum } from '@/config/menuEnum';
import { getBredName } from '@/utils/index';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

import styles from './index.less';

const { Sider } = Layout;
const { Item, SubMenu } = Menu;

export default memo(function Index() {
  const [collapsed, setCollapsed] = useState(false);
  const [selKeys, setSelKeys] = useState([]);
  const [openKeys, setOpenKeys] = useState([]);
  const history = useHistory();
  const { pathname } = useLocation();

  function mapMenu(item) {
    const { name, path, icon, children = [] } = item;
    if (children.length > 0)
      return (
        <SubMenu key={name} icon={icon || ''} title={name}>
          {children.map(mapMenu)}
        </SubMenu>
      );
    return (
      <Item key={name} icon={icon || ''} onClick={() => history.push(path)}>
        {name}
      </Item>
    );
  }

  useEffect(() => {
    const [selKeys, openKeys] = getBredName(menuEnum, pathname);
    setSelKeys([selKeys]);
    setOpenKeys([openKeys]);
  }, [pathname]);

  return (
    <Sider collapsedWidth={64} collapsed={collapsed} className={styles.sider} style={{ backgroundColor: '#192632' }}>
      <div className={styles.logo}>
        <img src="https://cdn.huarongxunfang.com/common/logo.jpeg" alt="" />
        <span>华融讯方商户控制台</span>
      </div>
      <Menu
        className={styles.menu}
        selectedKeys={selKeys}
        openKeys={openKeys}
        onOpenChange={(val) => setOpenKeys(val)}
        mode="inline"
      >
        {menuEnum.map(mapMenu)}
      </Menu>
      <div className={styles.collapsed}>
        {collapsed ? (
          <MenuUnfoldOutlined onClick={() => setCollapsed(false)} />
        ) : (
          <MenuFoldOutlined onClick={() => setCollapsed(true)} />
        )}
      </div>
    </Sider>
  );
});
