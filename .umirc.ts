import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  // routes: [
  //   { path: '/', component: '@/pages/index' },
  // ],
  title:'华融讯方商户控制台',
  fastRefresh: {},
  antd:{
    compact:true,
  },
  theme: {
    '@font-size-sm': '14px',
  },
});
