import { memo, useState, useEffect } from 'react';
import { history } from 'umi';
import { Pagination } from 'antd';
import { noticeList } from '@/services/index';
import styles from './index.less';

export default memo(function Index(props) {
  const [noticeListData, setNoticeListData] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    getNoticeList({ ...pagination });
  }, []);

  const getNoticeList = async (form) => {
    try {
      const res = await noticeList(form);
      setNoticeListData(res.data.data);
      setPagination((val) => ({ ...val, total: res.data.count }));
    } catch (error) {
      console.log(error);
    }
  };

  const onChange = (current, pageSize) => {
    console.log(current, pageSize);
    setPagination((val) => ({ ...val, page: current, limit: pageSize }));
    getNoticeList({
      page: current,
      limit: pageSize,
    });
  };

  return (
    <div className={styles.noticeContainer}>
      <div className={styles.noticeTitle}>
        <span>公告标题</span>
        <span>公告时间</span>
      </div>
      <div className={styles.noticeList}>
        {noticeListData.map((item) => {
          return (
            <div className={styles.noticeItem} key={item.id}>
              <div
                className={styles.noticeContent}
                onClick={() =>
                  history.push({
                    pathname: '/noticeList/detail',
                    state: { noticeId: item.id },
                  })
                }
              >
                【通知】{item.title}
              </div>
              <div className={styles.noticeDate}>{item.create_time}</div>
            </div>
          );
        })}
        <Pagination
          style={{ marginTop: '20px', fontSize: '14px' }}
          current={pagination.page}
          total={pagination.total}
          showQuickJumper
          showSizeChanger
          onChange={onChange}
        />
      </div>
    </div>
  );
});
