import { memo, useEffect, useState } from 'react';
import { Modal, Spin, Descriptions, Table } from 'antd';
import moment from 'moment';
import { getCallbackInfo } from '@/services/index';
import { statusList } from '../../index';

import styles from '../../index.less';

const { Item } = Descriptions;
const columns = [
  {
    title: '时间',
    dataIndex: 'create_time',
    key: 'create_time',
    width: 170,
    render: (text) => moment(text * 1000).format('YYYY-MM-DD HH:MM:SS'),
  },
  {
    title: '结果',
    dataIndex: 'callback',
    key: 'callback',
  },
];
export default memo(function Index({ info, ...rest }) {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const {
    id,
    create_time = '',
    status,
    order_no,
    product_category_name,
    product_name,
    account,
    money,
    merchant_no,
    merchant_money,
  } = info;

  useEffect(() => {
    getData(id, create_time);
  }, []);

  const getData = async (order_id, time) => {
    const month = (time || '').split('-').slice(0, 2).join('');
    setLoading(true);
    try {
      const { data } = await getCallbackInfo({
        order_id,
        month: month * 1,
      });
      setList(data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <Modal visible width={1000} title="详情" {...rest}>
      <Spin spinning={loading}>
        <div style={{ paddingLeft: 50 }}>
          <Descriptions column={2} className={styles.desc}>
            <Item label="状态">{statusList.find(({ value }) => value === status).label}</Item>
            <Item label="订单号">{order_no}</Item>
            <Item label="外部订单号">{merchant_no}</Item>
            <Item label="商品分类">{product_category_name}</Item>
            <Item label="商品名称">{product_name}</Item>
            <Item label="充值账号">{account}</Item>
            <Item label="充值金额">{money}</Item>
            <Item label="实际扣费">{merchant_money}</Item>
          </Descriptions>
          <div className={styles.tHead}>订单报文</div>
          <Table
            bordered
            className={styles.cTable}
            rowClassName={styles.row}
            columns={columns}
            dataSource={list}
            pagination={false}
          />
        </div>
      </Spin>
    </Modal>
  );
});
