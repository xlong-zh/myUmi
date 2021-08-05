import { memo, useMemo, useEffect, useState } from 'react';
import { Table, Switch } from 'antd';
import { getSetting, setNotice } from '@/services/index';
import styles from './index.less';

export default memo(function Index() {
  const [loading, setLoading] = useState(false);
  const [noticeList, setList] = useState([]);

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    setLoading(true);
    try {
      const {
        data: { auth_notice, account_notice },
      } = await getSetting({ type: 1 });
      setList([
        {
          name: '充值到账通知	',
          field: 'account_notice',
          desc: '转账充值到账后的通知',
          status: account_notice || '',
        },
        {
          name: '实名认证通知	',
          field: 'auth_notice',
          desc: '当您提交的实名认证审核有审核结果时，将通知到您',
          status: auth_notice || '',
        },
      ]);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleChange = async (e, field) => {
    const value = e ? 'on' : 'off';
    try {
      await setNotice({
        value,
        field,
      });
      setList((val) =>
        val.map((item) => {
          if (item.field === field) {
            return { ...item, status: value };
          }
          return item;
        }),
      );
    } catch (error) {
      console.log(error);
    }
  };
  const columns = useMemo(
    () => [
      {
        title: '通知名称',
        dataIndex: 'name',
        key: 'name',
        className: styles.cell,
      },
      {
        title: '说明',
        dataIndex: 'desc',
        key: 'desc',
        className: styles.cell,
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        className: styles.cell,
        render: (text, { field }) => (
          <Switch
            checkedChildren="开"
            unCheckedChildren="关"
            checked={text === 'on'}
            onChange={(e) => handleChange(e, field)}
          />
        ),
      },
    ],
    [noticeList],
  );
  return (
    <div style={{ padding: 20 }}>
      <Table
        bordered
        loading={loading}
        pagination={false}
        columns={columns}
        dataSource={noticeList}
        className={styles.table}
        rowKey={({ name }) => name}
      />
    </div>
  );
});
