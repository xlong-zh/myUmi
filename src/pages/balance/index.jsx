import React, { memo } from 'react';
import { connect } from 'dva';
import { Link } from 'umi';
import { Descriptions } from 'antd';
import styles from './index.less';
import { balanceList, getAccountInfo } from '@/services/index';
import moment from 'moment';
import { Row, Col, Divider, DatePicker, Form, Button, Select, Table } from 'antd';

const { RangePicker } = DatePicker;
const { Option } = Select;
const columns = [
  {
    title: '序号',
    dataIndex: 'projNum',
    key: 'projNum',
    render: (text, record, index) => ++index,
    width: '6%',
    align: 'center',
  },
  {
    title: '交易类型',
    dataIndex: 'type',
    key: 'type',
    width: '20%',
    align: 'center',
  },
  {
    title: '明细',
    dataIndex: 'detail',
    key: 'detail',
    width: '25%',
    align: 'center',
  },
  {
    title: '截止余额',
    dataIndex: 'amount',
    key: 'amount',
    width: '25%',
    align: 'center',
  },
  {
    title: '记录时间',
    dataIndex: 'create_time',
    key: 'create_time',
    render: (text, record) => moment(record).format('YYYY-MM-DD HH:mm:ss'),
    align: 'center',
  },
];

const defaultSelectDate = [moment().startOf('day').subtract(1, 'd'), moment().endOf('day')];

export default memo(function Index() {
  return (
    <div>
      <div>
        <Button type="primary" size="small" onClick={() => history.push('/home')}>
          查看
        </Button>
      </div>
    </div>
  );
});
