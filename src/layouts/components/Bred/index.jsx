import { memo, useMemo } from 'react';
import { useLocation, useRouteMatch } from 'umi';
import { menuEnum } from '@/config/menuEnum';
import { getBredName } from '@/utils/index';

export default memo(function Index() {
  const { pathname } = useLocation();

  const [bredName] = useMemo(() => getBredName(menuEnum, pathname), [pathname]);

  return (
    <div
      style={{
        height: 50,
        lineHeight: '50px',
        backgroundColor: '#fff',
        paddingLeft: 24,
      }}
    >
      {bredName || '后台管理'}
    </div>
  );
});
