import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  title: 'myUmi',
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
