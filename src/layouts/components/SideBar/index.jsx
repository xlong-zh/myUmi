import { useState, memo, useMemo } from 'react';
import { Layout, Menu } from 'antd';
import { useHistory, useLocation } from 'umi';
import { menuEnum } from '@/config/menuEnum';
import { getBredName } from '@/utils/index';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import logo from './img/logo.png';
import styles from './index.less';

const { Sider } = Layout;
const { Item, SubMenu } = Menu;

export default memo(function Index() {
  const history = useHistory();
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const [selKeys, openKeys] = useMemo(() => {
    return getBredName(menuEnum, pathname);
  }, [pathname]);

  const mapMenu = (item) => {
    const { name, path, icon, children = [] } = item;
    if (children.length) {
      return (
        <SubMenu key={name} icon={icon || ''} title={name}>
          {children.map(mapMenu)}
        </SubMenu>
      );
    }
    return (
      <Item key={name} icon={icon || ''} onClick={() => history.push(path)}>
        {name}
      </Item>
    );
  };

  return (
    <Sider collapsedWidth={64} collapsed={collapsed} className={styles.sider} style={{ backgroundColor: '#192632' }}>
      <div className={styles.logo}>
        <img src={logo} alt="" />
        <span>华融讯方商户控制台</span>
      </div>

      <Menu className={styles.menu} mode="inline" defaultSelectedKeys={[selKeys]} defaultOpenKeys={[openKeys]}>
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
