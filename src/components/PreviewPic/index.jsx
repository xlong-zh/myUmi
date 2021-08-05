import { memo, useRef, useMemo } from 'react';
import { Popover } from 'antd';
import styles from './index.less';

export default memo(function Index({ smallSrc, bigSrc, bordered, text = '示例' }) {
  const container = useRef(null);
  const content = useMemo(
    () => (
      <div className={styles.bigPic}>
        <img src={bigSrc} alt="" />
      </div>
    ),
    [],
  );

  return (
    <div className={styles.previewPic} ref={container}>
      <Popover content={content} autoAdjustOverflow={false} placement="right" getPopupContainer={container.current}>
        <div style={{ display: 'flex' }}>
          <div className={`${styles.picBox} ${bordered ? styles.border : ''}`}>
            <img src={smallSrc} alt="" />
          </div>
        </div>
      </Popover>
      <p style={{ marginTop: 15 }}>{text}</p>
    </div>
  );
});
