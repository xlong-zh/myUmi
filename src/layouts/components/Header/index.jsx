import { memo } from 'react';
import DropAvatar from '../DropAvatar';
import styles from './index.less';

export default memo(function Index({ style }) {
  return (
    <header className={styles.header} style={style}>
      <DropAvatar />
    </header>
  );
});
