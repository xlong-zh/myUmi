import { memo, useState, useEffect, useMemo, useRef } from 'react';
import { Table, DatePicker } from 'antd';
import moment from 'moment';
import SearchFrom from '@/components/SearchForm';
import { getBill } from '@/services/index';

import styles from './index.less';

export default memo(function Index() {
  const [list, setList] = useState([]);
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const cref = useRef();

  useEffect(() => {
    onSearch();
  }, []);

  const formSetting = [
    {
      name: 'between_time',
      label: '交易时间',
      type: 'rangePicker',
      colProps: { span: 10 },
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
  ];

  const columns = useMemo(
    () => [
      {
        title: '商户折扣',
        dataIndex: 'ratio',
        key: 'ratio',
        align: 'center',
      },
      {
        title: '分类',
        dataIndex: 'first_name',
        key: 'first_name',
        align: 'center',
      },
      {
        title: '面额',
        dataIndex: 'money',
        key: 'money',
        align: 'center',
      },
      {
        title: '单数',
        align: 'center',
        dataIndex: 'count',
        key: 'count',
      },
      {
        title: '商户扣费',
        dataIndex: 'merchant_money',
        key: 'merchant_money',
        align: 'center',
      },
    ],
    [],
  );

  const onSearch = () => {
    if (cref.current) {
      const values = cref.current.getSearchValues();
      getData(values);
    }
  };

  const getData = async (values) => {
    if (values.between_time) {
      values.between_time = `${values.between_time[0].format('YYYY-MM-DD HH:mm:ss')} ~ ${values.between_time[1].format(
        'YYYY-MM-DD HH:mm:ss',
      )}`;
    }
    setLoading(true);
    try {
      const { data = [] } = await getBill({ ...values });
      setList(data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <SearchFrom cref={cref} onFinish={(values) => getData(values)} formSetting={formSetting} />
      <Table
        bordered
        rowKey="first_id"
        columns={columns}
        dataSource={list}
        loading={loading}
        className={styles.table}
        pagination={false}
      />
    </div>
  );
});
