import { memo, useMemo } from 'react';
import UploadPic from '@/components/UploadPic';
import PreviewPic from '@/components/PreviewPic';

import license1 from './img/license1.png';
import license1_small from './img/license1_small.png';
import license2_small from './img/license2_small.png';
import license2 from './img/license2.png';
import license3_small from './img/license3_small.png';
import license3 from './img/license3.png';
import styles from '../index.less';

export default memo(function Index({ value, onChange }) {
  const exampleList = useMemo(
    () => [
      {
        smallSrc: license1_small,
        bigSrc: license1,
        text: '示例一',
      },
      {
        smallSrc: license2_small,
        bigSrc: license2,
        text: '示例二',
      },
      {
        smallSrc: license3_small,
        bigSrc: license3,
        text: '示例三',
      },
    ],
    [],
  );

  return (
    <div>
      <p className={styles.uploadTips}>
        请上传大小不超过 2M 的图片，支持.jpg .png
        格式。请提供证件的原件照片或彩色扫描件（正副本均可），文字/盖章清晰可见。
      </p>
      <div className={styles.licenseBox}>
        <UploadPic value={value} getUrl={(val) => onChange(val)} />
        {exampleList.map((ele) => (
          <PreviewPic key={ele.text} {...ele} />
        ))}
      </div>
    </div>
  );
});
