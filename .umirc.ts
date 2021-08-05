import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  title: '华融讯方商户控制台',
  fastRefresh: {},
  antd: {
    compact: true,
  },
  theme: {
    '@font-size-sm': '14px',
  },
  dynamicImport: {
    loading: '@/dynamicImport/Loading',
  },
  favicon: 'https://cdn.huarongxunfang.com/common/favicon.ico',
});
