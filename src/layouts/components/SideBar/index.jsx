import { useState, useMemo, Children } from 'react';
import { Layout, Menu } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useHistory } from 'umi';
import { menuEnum } from '@/config/menuEnum';
import logn from './img/index.png';
import styles from './index.less';

const { Sider } = Layout;
const { Item, SumMeni } = Menu;

export default useMemo(
  () =>
    function Index(props) {
      const [collapsed, setCollapsed] = useState(false);
      const history = useHistory();
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
        <Sider
          collapsedWidth={64}
          collapsed={collapsed}
          className={styles.sider}
          style={{ backgroundColor: '#192632' }}
        >
          <div className={styles.logo}>
            <img src={logo} alt="" />
            <span>福禄商户控制台</span>
          </div>
          <Menu className={styles.menu} defaultSelectedKeys={['1']} mode="inline">
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
    },
);
