import { memo, useState, useEffect } from 'react';
import { useLocation } from 'umi';
import styles from './index.less';
import { requestNoticeDetail } from '@/services/index';

export default memo(function Index(props) {
  const [content, setContent] = useState('');
  const { state } = useLocation();

  useEffect(() => {
    getNoticeDetail({ notice_id: state.noticeId });
  }, []);

  const getNoticeDetail = async (form) => {
    try {
      const res = await requestNoticeDetail(form);
      setContent(res.data.content);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.detailContainer}>
      <div dangerouslySetInnerHTML={{ __html: content }}></div>
    </div>
  );
});
