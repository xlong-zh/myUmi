import { memo, useMemo } from 'react';
import UploadPic from '@/components/UploadPic';
import PreviewPic from '@/components/PreviewPic';

import idcardA from './img/idcardA.png';
import idcardA_small from './img/idcardA_small.png';
import idcardB from './img/idcardB.png';
import idcardB_small from './img/idcardB_small.png';
import styles from '../index.less';

export default memo(function Index({ type, value, onChange }) {
  return (
    <div className={styles.idcardPic}>
      <h4>{`身份证${type}面`}</h4>
      <p>{`需上传身份证上印有${type}的那一面照片。`}</p>
      <UploadPic value={value} getUrl={onChange} style={{ display: 'inline-block' }} />
      <PreviewPic
        text="示例"
        bordered
        smallSrc={type === '头像' ? idcardA_small : idcardB_small}
        bigSrc={type === '头像' ? idcardA : idcardB}
      />
    </div>
  );
});
