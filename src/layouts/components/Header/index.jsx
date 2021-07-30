import { memo } from 'react';
import DropAvatar from '../DropAvatar';
import styles from './index.less';

export default memo(function Index(props) {
  return (
    <header className={styles.header}>
      <DropAvatar />
    </header>
  );
});
