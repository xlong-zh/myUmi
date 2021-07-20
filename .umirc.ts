import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  // routes: [
  //   { path: '/', component: '@/pages/index' },
  // ],
  title:'练习',
  fastRefresh: {},
  antd:{
    compact:true,
  },
  theme: {
    '@font-size-sm': '14px',
  },
});
