import { memo, useMemo } from 'react';
import { useLocation } from 'umi';
import { menuEnum } from '@/config/menuEnum';
import { getBredName } from '@/utils/index';

export default memo(function Index({ style }) {
  const { pathname } = useLocation();

  const [bredName] = useMemo(() => getBredName(menuEnum, pathname), [pathname]);

  return (
    <div
      style={{
        height: 50,
        lineHeight: '50px',
        backgroundColor: '#fff',
        paddingLeft: 24,
        ...style,
      }}
    >
      {bredName || '后台管理'}
    </div>
  );
});
