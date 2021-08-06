import { memo, useState, useEffect, useRef, useMemo } from 'react';
import moment from 'moment';
import { Table, Button } from 'antd';
import { getOrderList } from '@/services/index';
import SearchForm from '@/components/SearchForm';
import WatchModal from './components/WatchModal';
import styles from './index.less';

export const statusList = [
  {
    value: '',
    label: '全部',
  },
  {
    value: '0',
    label: '未知',
  },
  {
    value: '1',
    label: '充值中',
  },
  {
    value: '2',
    label: '成功',
  },
  {
    value: '3',
    label: '失败',
  },
];

export default memo(function Index() {
  const cref = useRef();
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [modal, setModal] = useState(false);
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState([]);

  useEffect(() => {
    onSearch();
  }, []);

  const onSearch = (current = 1, pageSize = 10) => {
    if (cref.current) {
      const values = cref.current.getSearchValues();
      getData(values, current, pageSize);
    }
  };

  const getData = async (values, current, pageSize) => {
    if (values.between_time) {
      values.between_time = `${values.between_time[0].format('YYYY-MM-DD HH:mm:ss')} ~ ${values.between_time[1].format(
        'YYYY-MM-DD HH:mm:ss',
      )}`;
    }
    setLoading(true);
    try {
      const {
        data: { data = [], count },
      } = await getOrderList({ page: current, limit: pageSize, ...values });
      setLimit(pageSize);
      setPage(current);
      setList(data);
      setTotal(count);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleWatch = (record) => {
    setInfo(record);
    setModal(true);
  };

  const onCancel = () => {
    setInfo({});
    setModal(false);
  };

  const formSetting = useMemo(
    () => [
      {
        name: 'status',
        label: '订单状态',
        type: 'select',
        initialValue: '',
        colProps: {
          span: 6,
        },
        compProps: {
          options: statusList,
        },
      },
      {
        name: 'order_no',
        label: '订单号',
        type: 'input',
        colProps: { span: 6 },
        compProps: {
          placeholder: '请输入订单号',
        },
      },
      {
        name: 'merchant_no',
        label: '外部订单号',
        type: 'input',
        colProps: { span: 6 },
        compProps: {
          placeholder: '请输入外部订单号',
        },
      },
      {
        name: 'product_id',
        label: '商品编号',
        type: 'input',
        colProps: { span: 6 },
        compProps: {
          placeholder: '请输入商品编号',
        },
      },
      {
        name: 'product_name',
        label: '商品名称',
        type: 'input',
        colProps: { span: 6 },
        compProps: {
          placeholder: '请输入商品名称',
        },
      },
      {
        name: 'account',
        label: '充值账号',
        type: 'input',
        colProps: { span: 6 },
        compProps: {
          placeholder: '请输入充值账号',
        },
      },
      {
        name: 'between_time',
        label: '交易时间',
        type: 'rangePicker',
        colProps: { span: 12 },
        initialValue: [moment().startOf('day'), moment().endOf('day')],
        compProps: {
          showTime: true,
          style: { width: '100%' },
          format: 'YYYY-MM-DD HH:mm:ss',
          disabledDate: (current) => {
            if (!dates || dates.length === 0) {
              return false;
            } else {
              const tooLate = dates[0] && current > moment(dates[0]).add(1, 'month').endOf('month');
              const tooEarly = dates[1] && current < moment(dates[1]).subtract(1, 'month').startOf('month');
              return tooEarly || tooLate;
            }
          },
          onCalendarChange: (vals) => {
            setDates(vals);
          },
          onOpenChange: (open) => {
            if (open) {
              setDates([]);
            }
          },
        },
      },
    ],
    [dates],
  );

  const columns = useMemo(
    () => [
      {
        title: '操作',
        dataIndex: 'edit',
        key: 'edit',
        width: 80,
        align: 'center',
        render: (_, record) => (
          <Button type="primary" onClick={() => handleWatch(record)}>
            查看
          </Button>
        ),
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 80,
        align: 'center',
        render: (text) => statusList.find(({ value }) => value === text).label,
      },
      {
        title: '订单号',
        dataIndex: 'order_no',
        key: 'order_no',
        width: 200,
        align: 'center',
        ellipsis: true,
      },
      {
        title: '外部订单号',
        dataIndex: 'merchant_no',
        key: 'merchant_no',
        width: 200,
        align: 'center',
        ellipsis: true,
      },
      {
        title: '商品分类',
        width: 200,
        align: 'center',
        ellipsis: true,
        dataIndex: 'product_category_name',
        key: 'product_category_name',
      },
      {
        title: '商品名称',
        dataIndex: 'product_name',
        key: 'product_name',
        width: 120,
        align: 'center',
      },
      {
        title: '充值账号',
        dataIndex: 'account',
        key: 'account',
        width: 120,
        align: 'center',
      },
      {
        title: '充值金额',
        dataIndex: 'money',
        key: 'money',
        width: 100,
        align: 'center',
      },
      {
        title: '实际扣费',
        dataIndex: 'merchant_money',
        key: 'merchant_money',
        width: 100,
        align: 'center',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
        width: 180,
        align: 'center',
      },
    ],
    [],
  );

  return (
    <div style={{ padding: 20 }}>
      <SearchForm cref={cref} onFinish={(values) => getData(values, page, limit)} formSetting={formSetting} />
      <Table
        bordered
        rowKey="id"
        columns={columns}
        dataSource={list}
        loading={loading}
        scroll={{
          x: 1000,
        }}
        className={styles.table}
        pagination={{
          pageSize: limit,
          total,
          showSizeChanger: true,
          showQuickJumper: false,
          onChange: onSearch,
        }}
      />
      {modal && <WatchModal info={info} onCancel={onCancel} footer={null} />}
    </div>
  );
});
