import {
  HomeOutlined,
  SettingOutlined,
  WalletOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';

export const menuEnum = [
  {
    name: '首页',
    path: '/home',
    icon: <HomeOutlined />,
  },
  {
    name: '个人资料',
    icon: <SettingOutlined />,
    children: [
      {
        name: '基本资料',
        path: '/basicInfo',
      },
      {
        name: '实名认证',
        path: '/realnameVerify',
      },
      {
        name: '通知设置',
        path: '/noticeSetup',
      },
    ],
  },
  {
    name: '财务管理',
    icon: <WalletOutlined />,
    children: [
      {
        name: '我的余额',
        path: '/balance',
      },
    ],
  },
  {
    name: '商品',
    icon: <ShoppingOutlined />,
    children: [
      {
        name: '商品列表',
        path: '/productList',
      },
      {
        name: '我的商品',
        path: '/myProduct',
      },
    ],
  },
  {
    name: '应用配置',
    icon: <AppstoreOutlined />,
    children: [
      {
        name: '密钥管理',
        path: '/secretKey',
      },
      {
        name: '参数配置',
        path: '/paramsOption',
      },
    ],
  },
];
