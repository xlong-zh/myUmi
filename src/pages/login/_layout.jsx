import { memo } from 'react';

import styles from './index.less';

export default memo(function Index({ children, ...rest }) {
  return (
    <div className={styles.main_box}>
      <div className={styles.hd}>
        <div className={styles.header}>
          <div>
            <img src="https://cdn.huarongxunfang.com/images/20210706/f2eaf19942ea298f13f3f1b123989872.jpg" />
          </div>
          <div className={styles.header_word}>官网首页</div>
        </div>
      </div>
      <div className={styles.wrap_box}>{children}</div>
    </div>
  );
});
